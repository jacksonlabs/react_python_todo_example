import React, { Component } from 'react';

import axios from 'axios';

import { Container, Row, Col } from 'reactstrap';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Table } from 'reactstrap';
import { Input, Button, InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';

import {ToDoContext} from './ToDoContext';

class MyProvider extends Component {
  state = {
    list: [],
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT,
    hideComplete: true,
    testFunction: this.testFunction,
    updateList: this.updateList.bind(this),
    fetchList: this.fetchList.bind(this),
    createItem: this.createItem.bind(this),
    deleteItem: this.deleteItem.bind(this),
    setStatus: this.setStatus.bind(this),
    updateTask: this.updateTask.bind(this),
    setHidden: this.setHidden.bind(this)
  }

  testFunction(arg) {
    console.log(`testFunction({arg: ${arg}})`);
  }

  setHidden(hidden) {
    console.log(`setHidden(${hidden})`);
    this.setState({
      hideComplete: hidden
    });
    this.fetchList();
  }

  updateList(list) {
    console.log('updateList({list: <list>})');
    if (this.state.hideComplete === true) {
      var filteredList = list.filter(function (task) {
        return task.complete === false;
      });
      this.setState({
        list: filteredList
      });
    } else {
      this.setState({
        list
      });
    }
  }

  async fetchList() {
    console.log('fetchList()');
    await axios.get(`${this.state.apiEndpoint}/api/todo`)
      .then(({ data })=> {
        this.updateList(data.objects);
      })
      .catch((err)=> {
        console.log(err)
      });
  }

  async createItem(description) {
    console.log(`createItem({description: ${description}})`);
    if (description !== '') {
      await axios
        .post(`${this.state.apiEndpoint}/api/todo`, {
          description: description,
          complete: false
        })
        .catch((err)=> {
          console.log(err)
        });
      this.fetchList();
    }
  }

  async deleteItem(id) {
    console.log(`deleteItem({id: ${id}})`);
    await axios
      .delete(`${this.state.apiEndpoint}/api/todo/${id}`)
      .catch((err)=> {
        console.log(err)
      });
    this.fetchList();
  }

  async setStatus(id, complete) {
    console.log(`setStatus({id: ${id}, complete: ${complete}})`);
    await axios
      .patch(`${this.state.apiEndpoint}/api/todo/${id}`, {
        complete: complete
      })
      .catch((err)=> {
        console.log(err)
      });
    this.fetchList();
  }

  async updateTask(id, description) {
    console.log(`updateTask({id: ${id}, description: ${description}})`);
    await axios
      .patch(`${this.state.apiEndpoint}/api/todo/${id}`, {
        description: description
      })
      .catch((err)=> {
        console.log(err)
      });
    this.fetchList();
  }

  render() {
    return (
      <ToDoContext.Provider value={{
        state: this.state,
        getDescription: id => {
          return this.state.list.find(todo => todo.id === id).description;
        },
        getStatus: id => {
          return this.state.list.find(todo => todo.id === id).complete;
        }
      }}>
        {this.props.children}
      </ToDoContext.Provider>
    );
  }
}

class ToDo extends Component {
  state = {
    complete: false,
    task: '',
    inFocus: false
  }

  componentDidMount = event => {
    this.setState({
      complete: this.context.getStatus(this.props.id),
      task: this.context.getDescription(this.props.id)
    });
  }

  toggleComplete() {
    const newStatus = !this.state.complete
    this.setState({
      complete: newStatus
    });
    this.context.state.setStatus(
      this.props.id,
      newStatus
    );
  }

  render() {
    var taskPanel;
    if (this.state.inFocus) {
      taskPanel = <React.Fragment>
                    <InputGroup>
                      <Input
                        value={this.state.task}
                        onChange={e => this.setState({task: e.target.value})}
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            this.context.state.updateTask(this.props.id, this.state.task);
                        this.setState({inFocus: false});
                          }
                        }}
                      />
                      <Button onClick={() => {
                        this.context.state.updateTask(this.props.id, this.state.task);
                        this.setState({inFocus: false});
                      }} color="primary" style={{ marginLeft: 10 }}>Save</Button>
                    </InputGroup>
                  </React.Fragment>;
    } else {
      taskPanel = <Label onClick={() => {this.setState({inFocus: true})}}>{this.state.task}</Label>;
    }
    return (
        <ToDoContext.Consumer>
          {(context) => (
              <tr>
                {/* <th scope="row">
                  {this.props.id}
                </th> */}
                <td align="center">
                  <Input type="checkbox" checked={this.state.complete} value={this.state.complete} onChange={e => {this.toggleComplete()}} />
                </td>
                <td>
                  {taskPanel}
                </td>
                <td align='right'>
                  <Button onClick={() => {context.state.deleteItem(this.props.id)}} color="danger">Delete</Button>
                </td>
              </tr>
          )}
        </ToDoContext.Consumer>
    );
  }
}
ToDo.contextType = ToDoContext;

class ToDoList extends Component {
  componentDidMount = event => {
    this.context.state.fetchList();
  }
  render() {
    return (
        <ToDoContext.Consumer>
          {(context) => (
            <div style={{ marginTop: 20 }}>
              <Table striped borderless width="100%">
                <thead>
                  <tr>
                    {/* <th>id</th> */}
                    <th width="10%" align="center">Complete</th>
                    <th>Task</th>
                    <th width="10%"></th>
                  </tr>
                </thead>
                <tbody>
                  {context.state.list.map(todo => <ToDo key={todo.id} id={todo.id}/>)}
                </tbody>
              </Table>
            </div>
          )}
        </ToDoContext.Consumer>
    );
  }
}
ToDoList.contextType = ToDoContext;

class ToDoAdd extends Component {
  state = {
    input: ''
  }

  render() {
    return (
        <ToDoContext.Consumer>
            {(context) => (
              <div style={{ marginTop: 20 }}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Task</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    value={this.state.input}
                    onChange={e => this.setState({input: e.target.value})}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        context.state.createItem(this.state.input);
                        this.setState({input: ''})
                      }
                    }}
                  />
                  <Button onClick={() => {
                    context.state.createItem(this.state.input);
                    this.setState({input: ''});
                  }} color="success" style={{ marginLeft: 10 }}>Add</Button>
                </InputGroup>
              </div>
            )}
        </ToDoContext.Consumer>
    )
  }
}

class ToDoSettings extends Component {
  state = {
    hidden: true
  }

  componentDidMount = event => {
    this.setState({
      input: this.context.state.hideComplete
    });
  }

  toggleHidden() {
    const newStatus = !this.state.hidden
    this.setState({
      hidden: newStatus
    });
    this.context.state.setHidden(
      newStatus
    );
  }

  render() {
    return (
        <ToDoContext.Consumer>
            {(context) => (
              <div style={{ marginTop: 20 }}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input addon type="checkbox" checked={this.state.hidden} value={this.state.hidden} onChange={e => {this.toggleHidden()}}/>
                    </InputGroupText>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>Hide Completed Tasks</InputGroupText>
                    </InputGroupAddon>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            )}
        </ToDoContext.Consumer>
    )
  }
}
ToDoSettings.contextType = ToDoContext;

class App extends Component {
  render() {
    return (
      <MyProvider>
        <p>env: {process.env.REACT_APP_ENVIRONMENT}</p>
        <p>node env: {process.env.NODE_ENV}</p>
        <p>api: {process.env.REACT_APP_API_ENDPOINT}</p>
        <div>
          <Navbar color="dark" dark className="navbar-expand">
            <NavbarBrand href="/" className="mr-auto">ToDo List <span role="img" aria-label="">🍺</span></NavbarBrand>
          </Navbar>
          <Container fluid>
            <Row>
              <Col><ToDoAdd /></Col>
            </Row>
            <Row>
              <Col><ToDoSettings /></Col>
            </Row>
            <Row>
              <Col><ToDoList /></Col>
            </Row>
          </Container>
        </div>
      </MyProvider>
    );
  }
}

export default App;