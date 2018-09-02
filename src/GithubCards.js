import React, { Component } from 'react';
import axios from 'axios';

const Card = (props) => {
    return (
        <div style={{ margin: '1em' }}>
            <img width="75" src={props.avatar_url} />
            <div style={{ display: 'inline-block', marginLeft: 10 }}>
                <div style={{ fontSize: '1.25em', fontWeight: 'bold' }}>
                    {props.name}
                </div>
                <div>{props.company}</div>
            </div>
        </div>
    );
};

const CardList = (props) => {
    return (
        <div>
            {props.cards.map(card => <Card {...card} />)}
        </div>
    );
};

class Form extends Component {
    state = { userNameInput: '' };

    onSubmitHandler = (event) => {
        event.preventDefault();
        //This is for the ref attribute approach on the input element
        //console.log("Does this work?", this.userNameInput.value);
        axios.get(`https://api.github.com/users/${this.state.userNameInput}`)
            .then(resp => {
                this.props.addCardHandler(resp.data);
                this.setState({ userNameInput: '' });
            }); 
    };

    //In order to see the text in the form you need to reload the component .setState does that
    //forceUpdate does that also
    render() {
        return (
            //onSubmit attribute was used here instead of an onClick attribute on 
            //the button element because you have more control over the whole form like the 
            //required attribute on the input element
            <form onSubmit={this.onSubmitHandler}>
                <input
                    type="text"
                    //The ref attribute is a React thing where you give it a function and it executes
                    // when the element is place on the DOM. In this example, input is the reference
                    // to that element. userNameInput is a variable placed on this component class and
                    // accessed later in another scope. Doing this in a different way.
                    // ref={(input) => this.userNameInput = input}

                    value={this.state.userNameInput}
                    onChange={(event) => this.setState({ userNameInput: event.target.value })}
                    placeholder="Github username"
                    required />
                <button type="submit">Add card </button>
            </form>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {
                //     name: "Ife George",
                //     company: "Domo",
                //     avatar_url: "https://avatars3.githubusercontent.com/u/11344929?v=4"
                // },
                // {
                //     name: "Paul O’Shannessy",
                //     company: "Facebook",
                //     avatar_url: "https://avatars1.githubusercontent.com/u/8445?v=4"
                // }
            ]
        };
    }

    addCardHandler = (cardInfo) => {
        // this.state.data.push(cardInfo)
        // this.setState({ data: this.state.data });
        this.setState(prevState => ({
            data : prevState.data.concat(cardInfo)
        }));
    };

    render() {
        return (
            <div>
                <Form addCardHandler={this.addCardHandler} />
                <CardList cards={this.state.data} />
            </div>
        );
    }
}

//Whenever you are trying to use a outside variable to be passed into a component in JSX you have to surround that variable with curly brackets
//ReactDOM.render(<CardList cards = {data} />, mountNode)
// ReactDOM.render(<App />, document.getElementById('root'));

// You have to export a class for other react files to see
export default App;


//ref={} attribute - reference id to element when placed on the DOM. You use this technique very rarely
//required attribure in input element -  makes sure that there is input in the text field before being able to click on the submit button
//event.preventDefault() - a function call that stops the expected behavior of the event. 
//                         For example if you were to capture the event on the form element when
//                         a user hits the submit button and you call preventDefault on that event
//                         captured then the page doesn't reload when it usually does normally. Instead
//                         let react update the DOM without reloading the page completely                            

/*
An endpoint for getting github api:
https://api.github.com/

An endpoint to get info of an github user:
https://api.github.com/users/ogeorge
*/