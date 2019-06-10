import { Query, Mutation, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import React from 'react';

class GraphHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            whatToRender: 'nothing'
        }
    }

    onButtonClick = (e) => {
        e.preventDefault();
        //get target id to figure out what to render
        this.setState({ whatToRender: e.target.id })
    }

    render() {
        return (
            <div>
                <button id="allUsers" onClick={this.onButtonClick}>Click here to show users</button>
                <button id="createUser" onClick={this.onButtonClick}>create User</button>
                <button id="findUser" onClick={this.onButtonClick}>Find User</button>
                {this.state.whatToRender === 'allUsers' && <GetAllUsers />}
                {this.state.whatToRender === 'createUser' && <CreateUser />}
                {this.state.whatToRender === 'findUser' && <DelayedQuery userName="admin2"/>}

            </div>
        )
    }
};

const GetAllUsers = () => {
    return (
        <Query
            query={
                gql`{
            users{
                firstName
                _id
            }
         }
        `
            }
        >
            {({ loading, error, data }) => {
                if (loading) return <p>LOADER...</p>;
                if (error) return <p>{error}</p>;

                return data.users.map(({ firstName, _id }) => (
                    <div key={_id}>
                        <p>{firstName}</p>
                    </div>));
            }
            }
        </Query>
    );

}



class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: ''
        }
    }

    render() {
        const { firstName, lastName, userName, email, password } = this.state;
        return (
            <Mutation mutation={
                gql`
                    mutation AddNewUser($firstName: String!, $lastName: String!, $userName: String!, $email: String!, $password: String!) {
                        addNewUser(firstName: $firstName, lastName: $lastName, userName: $userName, email: $email, password: $password){
                            firstName
                        }
                    }
                
                `
            }>
                {(AddNewUser, { data }) => (
                    <div>

                        <form onSubmit={e => {
                            console.log({ firstName, lastName, userName, email, password });
                            e.preventDefault();
                            AddNewUser({ variables: { firstName: firstName, lastName: lastName, userName: userName, email: email, password: password } });
                        }}>
                            <input
                                value={firstName}
                                onChange={e => this.setState({ firstName: e.target.value })}
                                type="text"
                                placeholder="First Name"
                            />
                            <input
                                value={lastName}
                                onChange={e => this.setState({ lastName: e.target.value })}
                                type="text"
                                placeholder="Last Name"
                            />
                            <input
                                value={userName}
                                onChange={e => this.setState({ userName: e.target.value })}
                                type="text"
                                placeholder="Username"
                            />
                            <input
                                value={email}
                                onChange={e => this.setState({ email: e.target.value })}
                                type="text"
                                placeholder="Email"
                            />
                            <input
                                value={password}
                                onChange={e => this.setState({ password: e.target.value })}
                                type="text"
                                placeholder="Password"
                            />
                            <button type="submit">CreateUser</button>
                        </form>

                        {data && <p>{data.addNewUser.firstName} created</p>}

                    </div>

                )}
            </Mutation>
        )
    }
}

class DelayedQuery extends React.Component {
    state = { user: null, username: '' };

    onUserFetched = user => this.setState(() => ({ user }));

    render() {
        return (
            <ApolloConsumer>
                {client => (
                    <div>
                        
                        <input
                            onChange={e => this.setState({ username: e.target.value })}
                            type="text"
                            placeholder="Username"
                        />
                        <button
                            //On click define the query to run
                            onClick={async () => {
                                const { data } = await client.query({
                                    query: FIND_USER,
                                    variables: { userName: this.state.username }
                                });
                                //Set user state to user recived from gql
                                this.onUserFetched(data.user);
                            }}
                        >
                            Search</button>
                        {this.state.user && <p>{this.state.user.firstName}</p> /*Render User when it is in state*/}
                    </div>
                )}
            </ApolloConsumer>
        );
    }
}

const FIND_USER = gql`
            query User($userName: String!){
                user(userName: $userName){
                    firstName
                    userName
                }
            }`

export default GraphHandler;