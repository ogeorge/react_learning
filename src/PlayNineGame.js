import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "font-awesome/css/font-awesome.min.css";
import './game.css'; //My defined css file that I imported
import _ from "lodash";

const Stars = (props) => {
    //Literally stuffing an array with html elements
    let stars = [];
    for (let i = 0; i < props.numberOfStars; i++) {
        //Had to add key property because without this I'll get errors 
        //in the console because react doesn't like to rely on index order
        //to differentiate between elements it prefers a unique identifier
        //between elements in an array when display
        stars.push(<i key={i} className="fa fa-star"></i>);
    }
    return (
        <div className="col-5">
            {/*Using that array of elements in jsx below to display the <i> elements*/}
            {stars}
        </div>
    );
}

const Button = (props) => {
    let button;
    switch (props.isAnswerCorrect) {
        case true:
            button =
                <button
                    onClick={props.acceptAnswer}
                    className="btn btn-success">
                    <i className="fa fa-check"></i>
                </button>
            break;
        case false:
            button =
                <button
                    className="btn btn-danger">
                    <i className="fa fa-times"></i>
                </button>
            break;
        default:
            button =
                <button
                    onClick={props.checkAnswer}
                    className="btn"
                    disabled={props.selectedNumbers.length === 0} >
                    =
            </button>
    }

    return (
        <div className="col-2 text-center">
            {/* You can save an element in a variable and use it in jsx */}
            {button}
            <br /> <br />
            <button
                className="btn btn-warning btn-sm"
                onClick={props.refreshStars}
                disabled={props.numberOfRefreshes === 0}>
                <i className="fa fa-refresh"></i>{"     " + props.numberOfRefreshes}
            </button>
        </div>
    );
}

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) =>
                <span key={i}
                    onClick={() => props.unSelectNumber(number)}>
                    {number}
                </span>
            )}
        </div>
    );
}

const Numbers = (props) => {
    // const arrayOfnumbers = _.range(1,10);

    //functional components can have their own functions
    const displaySelection = (number) => {
        if (props.usedNumbers.includes(number)) {
            return "used";
        }
        if (props.selectedNumbers.includes(number)) {
            return "selected";
        }
    }

    return (
        <div className="card text-center">
            <div>
                {/* We can do this same trick on the iteration above */}
                {Numbers.arrayOfnumbers.map((number, i) =>
                    //A function returning the class that this number needs based off the selected array 
                    <span key={i} className={displaySelection(number)}
                        //cant set the onClick attribute to a call of an function it has to be a reference to a function thats why I wrap my function call here with an anonymous
                        onClick={() => props.selectNumber(number)}>
                        {number}
                    </span>
                )}
            </div>
        </div>
    );
}

class DoneFrame extends Component {
    render() {
        return (
            <h2 className="text-center">
                {this.props.doneStatus}
            </h2>
        );
    }
}

/*
To avoid reloading arrayOfNumbers list on each render which could be costly
I can define the list and its contents outside of the function component
*/
Numbers.arrayOfnumbers = _.range(1, 10);

class Game extends Component {
    //Making static functions. Pulled out common logic between my setState calls
    static randomNumber = () => 1 + Math.floor(Math.random() * 9)

    state = {
        selectedNumbers: [],
        numberOfStars: Game.randomNumber(),
        //There is a concept of null
        isAnswerCorrect: null,
        usedNumbers: [],
        numberOfRefreshes: 5,
        doneStatus: null
    };

    addSelectedNumber = (number) => {
        if (!this.state.selectedNumbers.includes(number) && !this.state.usedNumbers.includes(number)) {
            this.setState((prevState) => ({
                selectedNumbers: prevState.selectedNumbers.concat(number),
                isAnswerCorrect: null
            }));
        }
    };

    // acceptAnswer = () => {
    //     this.setState(prevState => ({
    //         usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
    //         isAnswerCorrect: null,
    //         selectedNumbers: [],
    //         numberOfStars: Game.randomNumber()
    //     }));
    // }

    acceptAnswer = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length + prevState.selectedNumbers.length === 9) {
                return ({
                    usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
                    isAnswerCorrect: null,
                    selectedNumbers: [],
                    doneStatus: 'You Win!'
                });
            }
            let newStarAmount = Game.randomNumber();
            //Dont use push when adding elements to an array when the type of what you are pushing is not the 
            //same type of the elements in the array you are pushing to. Use concat when combining elements 
            //of an array with another array.
            prevState.usedNumbers = prevState.usedNumbers.concat(prevState.selectedNumbers);
            if(prevState.numberOfRefreshes === 0 && !this.possibleOptions(prevState, newStarAmount)){
                return ({
                    numberOfStars: newStarAmount,
                    isAnswerCorrect: null,
                    selectedNumbers: [],
                    doneStatus: 'Game Over!'
                });
            }
            return ({
                usedNumbers: prevState.usedNumbers,
                isAnswerCorrect: null,
                selectedNumbers: [],
                numberOfStars: newStarAmount,
            });
        });
    }

    unSelectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            //Notice that this is just sending back the state object but we're jsut changing one property
            //This is how you remove elements out of a list and return that resulting list
            selectedNumbers: prevState.selectedNumbers
                .filter(number => number !== clickedNumber),
            isAnswerCorrect: null
        }));
    };

    checkAnswer = () => {
        this.setState((prevState) => ({
            isAnswerCorrect: prevState.selectedNumbers
                //0 is the initial value. It's just in case if the array is empty
                .reduce((x, y) => x + y, 0) === prevState.numberOfStars
        }));
    }

    refreshStars = () => {
        if (this.state.numberOfRefreshes > 0) {
            this.setState(prevState => {
                let nextRefreshAmount = prevState.numberOfRefreshes - 1;
                let newStarAmount = Game.randomNumber();
                if (nextRefreshAmount > 0) {
                    return ({
                        numberOfStars: newStarAmount,
                        numberOfRefreshes: nextRefreshAmount,
                        isAnswerCorrect: null,
                        selectedNumbers: []
                    });
                }
                if (nextRefreshAmount === 0 && !this.possibleOptions(prevState, newStarAmount)) {
                    return ({
                        numberOfStars: newStarAmount,
                        numberOfRefreshes: nextRefreshAmount,
                        isAnswerCorrect: null,
                        selectedNumbers: [],
                        doneStatus: 'Game Over!'
                    });
                }
                return ({
                    numberOfStars: newStarAmount,
                    numberOfRefreshes: nextRefreshAmount,
                    isAnswerCorrect: null,
                    selectedNumbers: []
                });
            });
        }
    }

    possibleOptions = (prevState, newStarAmount) => {
        let result = false;
        let unusedNumbers = Numbers.arrayOfnumbers.filter(
            num => !prevState.usedNumbers.includes(num) && num <= newStarAmount);
        for (let i = 0; i < unusedNumbers.length; i++) {
            let tempList = unusedNumbers.slice(i, unusedNumbers.length);
            tempList.map((num, j) => {
                //.slice() doesn't include the last index
                if (tempList.slice(0, j + 1).reduce((x, y) => x + y, 0) === newStarAmount) {
                    result = true;
                    //This breaks out of the map function not the outer for loop
                    return;
                }
            });
            if (result) { break; }
        }
        return result;
    }

    render() {
        //Taking out the needed properties from state and initializing local variables so I dont have to keep typing this.state.numberOfStars it can just be numberOfStars when used
        const {
            numberOfStars,
            selectedNumbers,
            isAnswerCorrect,
            usedNumbers,
            numberOfRefreshes,
            doneStatus } = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numberOfStars={numberOfStars} />
                    <Button
                        selectedNumbers={selectedNumbers}
                        checkAnswer={this.checkAnswer}
                        isAnswerCorrect={isAnswerCorrect}
                        acceptAnswer={this.acceptAnswer}
                        numberOfRefreshes={numberOfRefreshes}
                        refreshStars={this.refreshStars} />
                    <Answer unSelectNumber={this.unSelectNumber} selectedNumbers={selectedNumbers} />
                </div>
                <br />
                {/* JSX ternary operator */}
                {doneStatus ?
                    <DoneFrame doneStatus={doneStatus} /> :
                    <Numbers selectNumber={this.addSelectedNumber} selectedNumbers={selectedNumbers} usedNumbers={usedNumbers} />}
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div>
                <Game />
            </div>
        );
    }
}

export default App;

/*
All I did to get font-awesome import was npm install font-awesome 
looked into the node-modules folder found the font-awesome directory
and found the minified css file and imported that right here.
These file relative path location starts at node-modules. Same exact 
steps for getting bootstrap into this file. Lodash seem to already be
apart of create-react-app.
*/

//<hr/> element puts a line between elements

/*
.map() is a predefined function on javascript arrays
.push() adds an element to the array and returns void
.concat() adds an element to the array and returns the new list
*/

/*
When you pass in a function as a parameter to setState you get the
previous state as a parameter to your anonymous function and you 
can change the properties that need to be changed. The unchanged
properties will remain the same.
 */

 /*
 Notice when I'm calling a function I can pass an object with properties
 and in the function declaration destructure the exact properties that I need 
 from the object but the variables that I'm pulling out of the object have to
 match the variable name in the method parameters. Follow the example below

 this.possibleSolutions(prevState)
 
 possibleSolutions = ({numberOfStars, usedNumbers}) => {

 }
 */

 /*
 this.setState() function call and take a function as a first parameter and 
 another function as a second parameter. The second parameter callback will be called
 directly after the first parameter callback is executed. This provides synchronous calls
 with an asynchronous this.setState() function call. Sometimes you may need to do this
 because other things may need to happen based off an updated state
 */