function Car(props) {
	const classes = ['card'];
	
	if (props.car.marked) {
		classes.push('marked');
	}
	
	return (
		<div className={classes.join(' ')} onClick={props.onMark}>
			<p>{props.car.name}</p>
		</div>
	)
}

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			cars: [
				{marked: false, name: 'Volga'},
				{marked: false, name: 'Mazda'}
			],
			visible: true,
			title: 'Cars app',
			isAuthenticated: false,
			users: []
		}
	}
	
	
	handleMarked(name) {
		const cars = this.state.cars.concat();
		
		const car = cars.find(c => {
			return c.name === name;
		});
		car.marked = !car.marked;
		this.setState({cars: cars})
	}
	
	renderCarsInfo() {
		if (!this.state.visible) {
			return null;
		}
		
		return this.state.cars.map(car => {
			return (
				<Car
					car={car}
					key={car.name + Math.random()}
					onMark={this.handleMarked.bind(this, car.name)}
				/>
			)
		})
	}
	
	toggleHandler() {
		this.setState({visible: !this.state.visible});
	}
	
	titleChangeHandler(title) {
		if (title.trim() === '') {
			title = 'Cars app';
		}
		this.setState({title: title})
	}
	
	authenticate() {
		const clientId = "vitgon-client";
		const clientSecret = "vitgon-secret";
		let hash = btoa(clientId + ":" + clientSecret);
		
		let data = "username=Alex123&password=password&grant_type=password";
		
		let context = this;
		
		fetch('/oauth/token', {
			method: 'POST',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Basic " + hash 
			},
			body: data
		})
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			console.log(JSON.stringify(data));
			
			localStorage.setItem("access_token", data.access_token);
			context.setState({isAuthenticated: true});
		})
		.catch(function (err) {
			console.error(err);
		})
	}
	
	authBtnMsg() {
		if (this.state.isAuthenticated) {
			return "Is logged in";
		} else {
			return "Log in";
		}
	}
	
	getUsers() {
		let context = this;
		
		fetch("/users/user", {
			method: 'GET',
			headers: {
				"Authorization": "Bearer " + localStorage.getItem('access_token')
			}
		})
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			context.setState({users: data});
		})
	}
	
	render() {
		return (
			<div className="wrapper">
				<h1>{this.state.title}</h1>
				<input
					placeholder={this.state.title}
					style={{marginRight: '2px', borderColor: 'red'}}
					onChange={(event) => this.titleChangeHandler(event.target.value)}
					value={this.state.title}
				/>
			
				<button onClick={this.toggleHandler.bind(this)} style={{marginRight: '20px'}}>Toggle cars</button>
				<button onClick={this.authenticate.bind(this)}>{this.authBtnMsg()}</button> <br/>
				
				<button onClick={this.getUsers.bind(this)}>Fetch users</button>
				
				<hr/>
				{ this.renderCarsInfo() }
				
				<hr style={{borderColor: 'red', height: 10, background: 'red'}}/>
				{ 
					this.state.users.map((user, i) => {
						return (
							<div>
								Id: {user.id}<br/>
								Username: {user.username}<br/>
								Salary: {user.salary}<br/>
								Age: {user.age}<br/>
								 <hr/>
							</div>
						);
					})
				}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))