import React, { Component } from 'react';
import './App.css';
import Landing from './Components/Landing';
import axios from 'axios';
import Qs from 'qs';
import ResultPage from './Components/ResultPage';
import SinglePet from './Components/SinglePet';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

class App extends Component {
    constructor() {
        super();
        this.state = {
            pets: [],
            breeds: {
                reptile: [],
                smallfurry: [],
                bird: []
            }
        }
    }

    componentDidMount() {
        const getBreeds = (animal) => {
            axios({
                url: 'https://proxy.hackeryou.com',
                method: 'GET',
                dataResponse: 'json',
                paramsSerializer: function (params) {
                    return Qs.stringify(params, {
                    arrayFormat: 'brackets'
                    })
                },
                params: {
                    reqUrl: 'https://api.petfinder.com/breed.list',
                    params: {
                        key: '729776b0ff12f97426ef03d015026841',
                        format: 'json',
                        output: 'full',
                        animal: animal,
                    },
                    xmlToJSON: false
                }
            }).then(res => {
                let breeds = res.data.petfinder.breeds.breed.map(breed => {
                    return breed.$t;
                }) ;
                this.setState({
                    breeds: {
                        ...this.state.breeds,
                        [animal]: breeds
                    }
                })
            })    
        }
        getBreeds('reptile');
        getBreeds('smallfurry');
        getBreeds('bird');
    }


    getPets = (location, type, age, sex, breed) => {
        console.log(location, type, age, sex, breed);
        this.setState({
            pets: []
        })
        axios({
            url: 'https://proxy.hackeryou.com',
            method: 'GET',
            dataResponse: 'json',
            paramsSerializer: function (params) {
                return Qs.stringify(params, {
                arrayFormat: 'brackets'
                })
            },
            params: {
                reqUrl: 'https://api.petfinder.com/pet.find',
                params: {
                key: '729776b0ff12f97426ef03d015026841',
                format: 'json',
                output: 'full',
                location: location,
                animal: type,
                age: age,
                count: 100,
                sex: sex,
                breed: breed
                },
                proxyHeaders: {
                'header_params': 'value'
                },
                xmlToJSON: false
            }
        }).then((res) => {
            console.log(res);
            if(res.data.petfinder.pets.pet) {

                let petsArray = Object.values(res.data.petfinder.pets)
                console.log(petsArray);
                // console.log(petsArray[0].length);
                if (petsArray[0].length) {
                    console.log(`case 1`);
                    
                    let pets = petsArray[0].filter((pet) => {
                        return pet.media.photos
                    });
                    if (pets.length === 0){
                        alert('it is 0')
                    }
                    this.setState({pets});
                } else if(petsArray[0].media.photos){
                    console.log(`case 2`);
                    
                    let pet = [ petsArray[0] ]; 
                    this.setState({
                        pets: pet
                    })
                } else {
                    console.log(`case 3`);
                    
                    alert('NO PET PHOTKA');
                }
            }


            else {alert('no pets SAAAAWRY')}; 
    
        })
    }
    
    render() {

        return (
            <Router>
                <div className="App">
                    <Route exact path="/" render={(props) => (
                        this.state.pets.length === 0 ?
                        <Landing {...props} breeds={this.state.breeds} getPets={this.getPets}/>
                        :
                        <Redirect to="/results" />
                    )}/>
                    {/* <ResultPage pets={this.state.pets}/> */}
                    <Route path="/pet/:pet_id" component={SinglePet} />
                    <Route path="/results" render={() => (
                        <ResultPage pets={this.state.pets} breeds={this.state.breeds} getPets={this.getPets}/>
                    )} />
                </div>
            </Router>
        );
    }
}

export default App;

{/* <Route exact path="/players" render={(props) => <Players {...props}
    numberOfPlayers={this.state.numberOfPlayers}
    addPlayers={this.addPlayers} />} /> */}