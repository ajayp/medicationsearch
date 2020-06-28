import React from 'react'
import ReactDOM from 'react-dom'
import Autosuggest from 'react-autosuggest'
import { debounce } from 'throttle-debounce'
import './styles.css'

function escapeRegexCharacters (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class AutoComplete extends React.Component {
    state = {
        value: '',
        suggestions: []
    }

    componentWillMount () {
        this.onSuggestionsFetchRequested = debounce(
            1,
            this.onSuggestionsFetchRequested
        )
    }

    getSuggestionValue = suggestion => {
        return suggestion.b;
    }

    getSuggestions = value => {
        const escapedValue = escapeRegexCharacters(value.trim());
        if (escapedValue === '') {
            return [];
        }
        return escapedValue;
    }

    renderSuggestion = suggestion => {
        return (
            <div className="brandname">
                <div>{suggestion.b}</div>
                <div className="strength">{suggestion.s}</div>
            </div>
        )
    }

    onChange = (event, { newValue }) => {
        this.setState({ value: newValue })
    }

    onSuggestionsFetchRequested = async ({ value }) => {
        const searchQueryName = this.getSuggestions(value);
        await fetch(`/api/search/?q=${searchQueryName}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ suggestions: result })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block else we will swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                })
    }

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] })
    }

    render () {
        const { value, suggestions } = this.state
        const inputProps = {
            placeholder: 'Type medication name...',
            value,
            onChange: this.onChange,
            autoFocus: true
        }

        return (
            <div className="App1">
                <div className="title">
                    Medication Search for brands and associated generics</div>
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={suggestion => suggestion.b}
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        )
    }
}

export default AutoComplete;

const rootElement = document.getElementById('root')
ReactDOM.render(<AutoComplete />, rootElement)
