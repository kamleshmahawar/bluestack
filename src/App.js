import { connect } from 'react-redux';
import './App.scss';
import React, { Component } from 'react';
import { fetchSections, updateSctions } from './reducer';

const labels = {
  'past': 'days ago',
  'future': 'days later',
  'live': 'live',
}
export class App extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: false,
      currentView: 'future',
      showDateSelector: {},
    };
  }

  componentDidMount() {
    this.loadSections();
  }

  loadSections() {
    var that = this;
    that.setState({ showLoader: true });
    that.props.dispatchFetch().then(function () {
      that.setState({ showLoader: false });
    });
  }

  changeView(view) {
    this.setState({ currentView: view });
  }

  changeDateHandler(e, section) {
    this.props.dispatchUpdate(e.target.value, section);
    this.setState({ showDateSelector: '' });
  }

  toggleDate(e, section) {
    e.stopPropagation();
    this.setState({ showDateSelector: section.eventName });
  }

  hideDate() {
    this.setState({ showDateSelector: '' });
  }

  render() {
    const { sections } = this.props;
    const { showLoader, currentView, showDateSelector } = this.state;
    return (
      <div className="App" onClick={this.hideDate.bind(this)}>
        <h1>Manage Campaigns</h1>
        <hr />
        {showLoader && <div className="loader">
          <img src="./loader.gif" alt="Loading..." width="400" height="400" />
        </div>}
        <div className="tab-btn-wrapper">
          <button className={currentView === 'future' ? 'active' : ''} onClick={this.changeView.bind(this, 'future')}>UPCOMING COMPAIGNS</button>
          <button className={currentView === 'live' ? 'active' : ''} onClick={this.changeView.bind(this, 'live')}>LIVE COMPAIGNS</button>
          <button className={currentView === 'past' ? 'active' : ''} onClick={this.changeView.bind(this, 'past')}>PAST COMPAIGNS</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>COMPAIGN</th>
              <th>VIEWS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {
              sections && sections[currentView] && sections[currentView].length > 0 &&
              sections[currentView].map((section) => (
                <tr key={section.eventName}>
                  <td>
                    <div>{section.date}</div>
                    <div>{`${section.days === 0 ? '' : section.days} ${labels[currentView]}`}</div>
                  </td>
                  <td>
                    <div className="row">
                      <div className="event-logo col">
                        <img src="./logo192.png" alt="loading..." />
                      </div>
                      <div className="col">
                        <div>{section.eventName}</div>
                        <div>{section.locale}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="center">
                      <img src="./dollar.png" alt="loading..." />
                    </div>
                  </td>
                  <td>
                    <div className="center cursor action" onClick={(e) => this.toggleDate(e, section)} >
                      <img src="./Calendar.png" alt="loading..." />
                      {(showDateSelector === section.eventName) && <div className="dateSelector">
                        <input type="date" className="date" value={section.date} onChange={(e) => this.changeDateHandler(e, section)} />
                      </div>}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sections: state.sections,
})

const mapDispatchToProps = {
  dispatchUpdate: updateSctions,
  dispatchFetch: fetchSections,


}

export default connect(mapStateToProps, mapDispatchToProps)(App);
