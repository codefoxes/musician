const callbacks = []

export const mediaQuery = {
	onChange: (cb) => {
		callbacks.push(cb)
	},
	currentMedia: 'mobile',
	currentSize: ''
}

const queryObjects = []

function updateMediaQueryObject (matches, queryObject) {
	if (matches) {
		mediaQuery.currentMedia = queryObject.device
		switch (queryObject.device) {
			case 'tablet-only':
				mediaQuery.currentSize = 'tablet'
				break
			case 'desktop-only':
				mediaQuery.currentSize = 'tablet desktop'
				break
			case 'widescreen':
				mediaQuery.currentSize = 'tablet desktop'
				break
			default:
				mediaQuery.currentSize = ''
		}
	}
}

function listener (e, queryObject) {
	mediaQuery.currentSize = ''
	updateMediaQueryObject(e.matches, queryObject)
	callbacks.forEach(cb => cb())
}

function useMediaQuery (queryInput, device) {
	queryObjects.forEach((queryObject) => {
		queryObject.queryList.removeListener((e) => { listener(e, queryObject) })
	})
	queryObjects.push({
		queryList: window.matchMedia(queryInput),
		device
	})
	queryObjects.forEach((queryObject) => {
		queryObject.queryList.addListener((e) => { listener(e, queryObject) })
		const { matches } = queryObject.queryList
		updateMediaQueryObject(matches, queryObject)
	})
}

// Reference: https://bulma.io/documentation/overview/responsiveness/

export const init = () => {
	useMediaQuery('(max-width:768px)', 'mobile')
	useMediaQuery('(min-width:769px) and (max-width:1023px)', 'tablet-only')
	useMediaQuery('(min-width:1024px) and (max-width:1215px)', 'desktop-only')
	useMediaQuery('(min-width:1216px)', 'widescreen')
}

export default useMediaQuery
