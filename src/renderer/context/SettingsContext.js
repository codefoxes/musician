import React from 'react'
import PropTypes from 'prop-types'
import { init as mqInit, mediaQuery } from '../services/MediaQuery'
import Firebase from '../services/Firebase'

mqInit()

const DEFAULT_STATE = {
	settings: {
		showSidebar: (mediaQuery.currentMedia !== 'mobile')
	},
	currentMedia: mediaQuery.currentMedia,
	currentSize: mediaQuery.currentSize
}

export const SettingsContext = React.createContext(DEFAULT_STATE)

export default class SettingsContextProvider extends React.Component {
	constructor (props) {
		super(props)
		this.state = DEFAULT_STATE
		mediaQuery.onChange(this.onMediaChange)
		const fb = new Firebase()
		fb.initialize()
	}

	onMediaChange = () => {
		if (mediaQuery.currentMedia === this.state.currentMedia) return
		this.setState((prev) => {
			const { settings } = prev
			const { currentMedia, currentSize } = mediaQuery
			settings.showSidebar = (currentMedia !== 'mobile')
			return { currentMedia, currentSize, settings }
		})
	}

	dispatch = (action, args) => {
		if (action === 'toggle_sidebar') {
			this.setState((prev) => {
				const { settings } = prev
				settings.showSidebar = !prev.settings.showSidebar
				return { settings }
			})
		}
	}

	render () {
		const { children } = this.props
		return (
			<SettingsContext.Provider
				value={{
					...this.state,
					dispatch: this.dispatch
				}}
			>
				{ children }
			</SettingsContext.Provider>
		)
	}
}

SettingsContextProvider.propTypes = {
	children: PropTypes.node.isRequired
}
