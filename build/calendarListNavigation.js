/**
 * Created by smithmd on 7/22/15.
 */

var NavigationPaging = React.createClass({displayName: "NavigationPaging",
  handleClick: function (date, toPrev) {

    var m = moment(date);
    var newDate = m.clone();
    if (toPrev) {
      if (this.props.pageDays === 7) {
        newDate.subtract(m.day() + 7, 'days');
      } else {
        newDate.subtract(this.props.pageDays, 'days');
      }
    } else {
      if (this.props.pageDays === 7) {
        newDate.add(7 - m.day(), 'days');
      } else {
        newDate.add(this.props.pageDays, 'days');
      }
    }
    selectedDate.onNext({date: newDate.format('YYYY-MM-DD')});
  },
  render: function () {
    return (
        React.createElement("li", {className: "navPaging"}, 
          React.createElement("span", {id: "prev", onClick: this.handleClick.bind(this,this.props.date,true)}, "‹"), 
          React.createElement("span", {id: "next", onClick: this.handleClick.bind(this,this.props.date,false)}, "›")
        )
    );
  }
});
var NavigationDay = React.createClass({displayName: "NavigationDay",
  handleClick: function (date) {
    selectedDate.onNext({date: date.format('YYYY-MM-DD')});
  },
  render: function () {
    var boundClick = this.handleClick.bind(this, this.props.date);
    return (
        React.createElement("li", {className: classNames({isSelected: this.props.isSelected}), "data-day": this.props.date.format('YYYY/MM/DD'), 
            onClick: boundClick}, 
          React.createElement("span", {className: classNames('dayOfWeek')}, this.props.date.format('ddd'), " "), 
          React.createElement("span", {className: "navDate"}, this.props.date.format('MM/DD'))
        )
    );
  }
});
var Navigation = React.createClass({displayName: "Navigation",
  getInitialState: function () {
    return {
      date: moment(),
      originalDate: moment(),
      narrow: window.matchMedia("screen and (max-width:800px)").matches
    };
  },
  componentDidMount: function () {
    var component = this;
    selectedDate.subscribe(function (s) {
      component.setState({date: moment(s.date)});
    });

    var mql = window.matchMedia("screen and (max-width:800px)");
    mql.addListener(function (e) {
      component.setState({narrow: e.matches});
    });
  },
  render: function () {
    var date = this.state.date;
    var dayInt = date.day();
    var days = [];
    var pageDays = 7;
    if (this.state.narrow) {
      pageDays = 3;
    }
    for (var i = 0; i < pageDays; i++) {
      var d;
      if (pageDays === 7) {
        d = date.clone().add(i - dayInt, 'days');
      } else {
        var diffDays = date.startOf('day').diff(this.state.originalDate.startOf('day'), 'days');
        if (diffDays >= 0) {
          d = date.clone().add(i - (diffDays % pageDays), 'days');
        } else {
          d = date.clone().add(i - mod(diffDays, pageDays), 'days');
        }
      }
      var isSelected = date.isSame(d, 'day');
      days.push(
          React.createElement(NavigationDay, {day: i, date: d, key: 'm'+d.format('YYYY/MM/DD'), isSelected: isSelected})
      );
    }
    return (
        React.createElement("ul", null, 
          days, 
          React.createElement(NavigationPaging, {pageDays: pageDays, date: this.state.date})
        )
    );
  }
});

React.render(
    React.createElement(Navigation, null),
    document.getElementById('navigation')
);