import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';
import UserGuessForm from './userGuessForm';

export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
    }

    render() {
        let index;
        index = this.props.index;
        console.log(index);
        if(!this.props.protectedData || !this.props.protectedData.length) {
            return <div>Loading...</div>
        }

        return (
            <div className="dashboard">
                <div className="dashboard-name">Hello {this.props.name}</div>
                <div className="dashboard-protected-data">
                    {this.props.protectedData[index].spanish}
                </div>
                <UserGuessForm />
                <div className='message'>
                    {this.props.message}
                </div>
                <div className='progress'>
                    Amount correct: {this.props.progress}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: currentUser.name,
        protectedData: state.protectedData.data,
        message: state.auth.message,
        index: state.protectedData.index,
        progress: state.auth.correctCount
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));