import React from 'react'

/*

Consume the following GET endpoint:
https://reqres.in/api/unknown?per_page=12
It will return a JSON object. The data property of that object is an array of colors.

Using React:

- Fetch that endpoint.
- Render cards in the screen with each color. Each card should at least have the name of the color. The cards (or part of the card's background) should have a background color representing itself (you can use the HEX value). Have fun with it, get as creative as you want.
- Make it so that using only CSS, hovering on each card will make them zoom without shifting or moving any adjacent cards.
- Finally, implement it so that clicking on any card will open a lightbox modal in the center of the page, displaying any more details you want about that color. Clicking outside of the lightbox should close it.
- If at any point during the exercise you want to break the spec above to get really creative and implement something you really like, please do so.

The solution has to use React and only functional components and hooks, no classes.

- To submit, simply fork this codepen, implement your solution and send it to us via LinkedIn or via email to antonio@usesilo.com.

*/
const url = 'https://reqres.in/api/unknown?per_page=12'

const App = () => {
    const [colors, setColors] = React.useState([])
    const [showLightbox, setShowLightbox] = React.useState(false)
    const [lightbox, setLightbox] = React.useState({})

    // todo: add loading
    // Fetching data from endpoint on page load
    React.useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((results) => setColors(results.data))
            .catch((reason) => {
                // todo: move data to frontend
                // todo: more error handling
                console.log(reason)
            })
    }, [])

    return (
        <>
            <div
                style={{
                    maxWidth: '1000px',
                    margin: '150px auto',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {colors.map((color, index) => (
                    <div key={`${color.name}_${index}`}>
                        <div
                            className="colorCard"
                            style={{ backgroundColor: color.color }}
                            onClick={() => {
                                setShowLightbox(true)
                                setLightbox(color)
                            }}
                        >
                            <div
                                style={{
                                    color: lightOrDark(color.color)
                                        ? '#000000c2'
                                        : '#ffffffc2',
                                }}
                            >
                                <h4>{color.name}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showLightbox ? (
                <Lightbox
                    props={lightbox}
                    close={() => setShowLightbox(false)}
                />
            ) : null}
        </>
    )
}

export default App

const Lightbox = ({ props, close }) => {
    const [load, setLoad] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        setLoad(true)
        return () => {
            setLoad(false)
        }
    }, [])

    // set timer after text is copied
    React.useEffect(() => {
        let copiedTimer
        if (copied) {
            copiedTimer = setTimeout(() => setCopied(false), 1500)
        }
        // clean up timer
        return () => clearTimeout(copiedTimer)
    }, [copied])

    return (
        <div className={(load ? 'loaded' : '') + ' lightbox'}>
            <div
                onClick={() => {
                    setLoad(false)
                    setTimeout(() => close(), 300)
                }}
                className="lightboxBg"
            />
            <div
                className={(load ? 'loaded' : '') + ' lightboxCard'}
                style={{
                    backgroundColor: props.color,
                }}
            >
                <div
                    style={{
                        // set color to light or dark to contrast background color
                        color: lightOrDark(props.color)
                            ? '#000000c2'
                            : '#ffffffc2',
                    }}
                >
                    <h1>{props.name}</h1>
                    <p
                        className="tooltip"
                        onClick={() =>
                            navigator.clipboard
                                .writeText(props.color)
                                .then((r) => setCopied(true))
                        }
                    >
                        {props.color}
                        <span className="tooltipMsg">
                            {copied ? 'Copied!' : 'Click to Copy'}
                        </span>
                    </p>
                    <h4>
                        <br/>
                        <hr
                            style={{
                                // set color to light or dark to contrast background color
                                borderColor: lightOrDark(props.color)
                                    ? '#000000c2'
                                    : '#ffffffc2',
                            }}
                        />
                        Year: {props.year}
                        <br/>
                        Pantone Value: {props.pantone_value}
                        <br/>
                    </h4>
                </div>
            </div>
        </div>
    )
}

// check if color is light or dark
// return boolean, true if light or false if dark
function lightOrDark(color) {
    // Variables for red, green, blue values
    let r, g, b, hsp

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If RGB --> store the red, green, blue values in separate variables
        color = color.match(
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
        )
        r = color[1]
        g = color[2]
        b = color[3]
    } else {
        // If hex --> Convert it to RGB
        color = +(
            '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
        )
        r = color >> 16
        g = (color >> 8) & 255
        b = color & 255
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

    // Using the HSP value, determine whether the color is light or dark
    return hsp > 127.5
}
