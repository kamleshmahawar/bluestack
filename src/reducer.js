import axios from 'axios';
export let actualData = [];

export const reducerName = (state = { sections: [] }, action) => {
    switch (action.type) {
        case 'FETCH':
            return { sections: action.data };
        case 'UPDATE':
            return { sections: action.data };
        default:
            return state
    }
}

export const fetchSections = () => {
    return (dispatch) =>
        axios.get('./data.json').then((res) => {
            actualData = [...res.data];
            dispatch({ type: 'FETCH', data: convertData(res.data) })
        });
}

export const convertData = (data) => {
    const result = { live: [], past: [], future: [] };
    data.forEach((item) => {
        let temp = compareDate(new Date(item.date));
        let days = Math.abs(parseInt(temp));
        let b = new Date();
        let month = b.getMonth() + 1;
        let today = `${b.getFullYear()}-${month < 10 ? '0' + month : month}-${b.getDate()}`;
        if (today === item.date) {
            result.live.push({ ...item, days });
        } else if (temp > 0) {
            result.future.push({ ...item, days });
        } else {
            result.past.push({ ...item, days });
        }
    });
    return result;
}

export const compareDate = (a) => {
    const b = new Date();
    return (a.getTime() - b.getTime()) / 86400000;
}

export const updateSctions = (value, section) => {
    return (dispatch) => {
        let data = [...actualData];
        data.forEach(_i => {
            if (_i.eventName === section.eventName) {
                _i.date = value;
            }
        });
        actualData = data;
        dispatch({ type: 'UPDATE', data: convertData(data) });
    }
}