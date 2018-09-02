import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AuthorQuiz extends Component {
    render() {
        let test = "Blah";
        for(let i = 0; i< test.length; i++ ) {
            console.log(test[i]);
        }
        return (
            <div>
                <h2>Hello World!</h2>
            </div>
        );
    }
}

//Notice that I can just add "export default" right before "class AuthorQuiz"
//And it will do the same thing as that line below does

// export default AuthorQuiz;

//Component lifecycle stuff
//for example componentDidMount() or componentWillMount()
//These are functions in class based components that you can implement for whatever reasons


/*
You'll have to install prop-types first from npm
import PropTypes from 'prop-types';

Sum.propTypes = {
    a:PropTypes.number.isRequired,
    b:PropTypes.number.isRequired
}
This syntax is the way to make sure props a and b of component Sum is of type number
If they are passed anything else other than a number you get a javascript error
.isRequired means you have to initial that prop. This type checking happens at runtime (dynamically typed)


An alternative option that offers static type(compile time error) checking is using TypeScript. Follow the
example below:

interface SumProps {
    a: number;
    b: number;
}

function Sum(props: SumProps) {
    return <h1>{props.a} + {props.b} = {props.a + props.b}</h1>;
}
*/