// Write JavaScript here and press Ctrl+Enter to execute

//function component
const Button1 = (props) => {
	return (
  	<button>{props.label}</button>//JSX
  );
};

//Class component, can hold state function components cannot
class Button extends React.Component {
	constructor(props) {
  	super(props);
    this.state = {counter : 0};
  }
  
  handleClick2 = () => {
  	this.setState((prevState) => {
    	return {
    		counter : prevState.counter +1
      };
    })
  };
  
  //OR
  
  handleClick3 = () => {
  	this.setState((prevState) => ({
    		counter : prevState.counter +1
    }));
  };
  
  handleClick = () => {
		//.setState is an asynchronous function call so you could get into a race condition if you have to set the state based off other state properties. In order to avoid problems use the setState function defined in handleClick2 or handleClick3. setState calls could be batched for performance.
  	this.setState({
    	counter : this.state.counter +1
    })
  };
  
	render() {
  	return(
    	//JSX which looks like html but isn't, this turns into javascript function calls which then puts actual elements on the DOM
    	<button onClick = {this.handleClick}>
      	{this.state.counter}
      </button>
    )
  }
}

//mountNode is the component that you are putting your defined components on, mountNode is the 		id of the div
//"label" is a property on the props variable argument passed into the component
ReactDOM.render(<Button label = "DO"/>, mountNode)