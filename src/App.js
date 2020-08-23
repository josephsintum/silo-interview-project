import React from "react"

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
const url = "https://reqres.in/api/unknown?per_page=12"

// private client key for unsplash api and will be deactivated on Aug 30th
const client_id = "rDK3DGIzMN5mAlpY-qLfE_j8ChXA0Z6vWaRcjgjxA38"

// referral query for Unsplash attribution
// see https://help.unsplash.com/en/articles/2511315-guideline-attribution
const referralQuery = "/?utm_source=color_picker&utm_medium=referral"

const App = () => {
    // Holds array of colors from reqres.in api
    const [colors, setColors] = React.useState([])
    // Boolean to show or hide lightbox
    const [showLightbox, setShowLightbox] = React.useState(false)
    // holds lightbox color object
    const [lightbox, setLightbox] = React.useState({})
    // handles loading and error states
    const [loading, setLoading] = React.useState({ status: false, error: null })

    // Fetching data from endpoint on page load
    React.useEffect(() => {
        setLoading((prevState) => ({ ...prevState, status: true }))
        fetch(url)
            .then((response) =>
                response.json().then((data) => {
                    setLoading((prevState) => ({ ...prevState, status: false }))
                    if (!response.ok) throw Error(data.errors || "HTTP error")
                    return data
                })
            )
            .then(
                (results) => {
                    // Getting image from unsplash API
                    results.data.map((color) => {
                        // Unsplash API, search query -> https://unsplash.com/documentation#get-a-random-photo
                        let unsplashURL = `https://api.unsplash.com/photos/random/?client_id=${client_id}&query=${color.name}`

                        // fetch images from unsplash API with color.name as query
                        // add images to color object as color.image
                        // add color object to state
                        fetch(unsplashURL, { referrerPolicy: "no-referrer" })
                            .then((response) =>
                                response.json().then((data) => {
                                    if (!response.ok)
                                        throw Error(data.errors || "HTTP error")
                                    return data
                                })
                            )
                            .then(
                                (results) => {
                                    // adding images to color object
                                    color.image = {
                                        url: results.urls.regular,
                                        photographer: results.user.name,
                                        profile: results.user.links.html,
                                    }
                                    // adding color object to state
                                    setColors((prevState) => [
                                        ...prevState,
                                        color,
                                    ])
                                },
                                (error) => {
                                    setColors((prevState) => [
                                        ...prevState,
                                        color,
                                    ])
                                    console.log(error)
                                }
                            )
                        return color
                    })
                },
                (error) => {
                    setLoading((prevState) => ({ ...prevState, error: error }))
                    console.log(error)
                }
            )
    }, [])

    // handle body scroll when lightbox is open
    React.useEffect(() => {
        if (showLightbox) document.body.classList.add("noScroll")
        else document.body.classList.remove("noScroll")
    }, [showLightbox])

    return (
        <main>
            <div className="intro container">
                <h1>An array of colors</h1>
                <p>
                    This is a demo application, in response to{" "}
                    <a href="https://codepen.io/abmirayo/pen/GRZgYmz">
                        Silo's magic color challenge
                    </a>
                    <br />
                    This is a grid of cards with each showing color in the
                    background(from HEX value) and has the name of the color
                    either light or dark to contrast the background color.
                    <br />
                    On hover, each card zooms without shifting or moving any
                    adjacent cards.
                    <br />
                    On clicking, the card opens a lightbox modal in the center
                    of the page, displaying more details about that color and a
                    random photo(from unsplash) with reference to that color.
                    <br />
                    Clicking on the HEX value or pantone value will copy to
                    clipboard.
                    <br />
                    Clicking out of the card will close the lightbox modal.
                </p>
            </div>
            {loading.state ? (
                <h2>Loading colors</h2>
            ) : loading.error ? (
                <h2>An error occurred: {loading.error}</h2>
            ) : (
                <section className="container">
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
                                            ? "#000000c2"
                                            : "#ffffffc2",
                                    }}
                                >
                                    <h4>{color.name}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                    {showLightbox ? (
                        <Lightbox
                            props={lightbox}
                            close={() => setShowLightbox(false)}
                        />
                    ) : null}
                </section>
            )}
        </main>
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
        <div className={(load ? "loaded" : "") + " lightbox"}>
            <div
                onClick={() => {
                    setLoad(false)
                    setTimeout(() => close(), 300)
                }}
                className="lightboxBg"
            />
            <div
                className={(load ? "loaded" : "") + " lightboxCard"}
                style={{
                    backgroundColor: props.color,
                }}
            >
                {/*Lightbox Image*/}
                {props.image ? (
                    <div className="divImg">
                        <img
                            alt={props.name}
                            src={props.image.url}
                            className="responsiveImg"
                        />
                        <label className="unsplashCredit">
                            Credit to{" "}
                            <a
                                href={props.image.profile + referralQuery}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {props.image.photographer}
                            </a>{" "}
                            on{" "}
                            <a
                                href={`https://unsplash.com${referralQuery}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Unsplash
                            </a>{" "}
                        </label>
                    </div>
                ) : (
                    ""
                )}

                {/*Lightbbox body*/}
                <div
                    className="lightboxInfo"
                    style={{
                        // set color to light or dark to contrast background color
                        color: lightOrDark(props.color)
                            ? "#000000c2"
                            : "#ffffffc2",
                    }}
                >
                    <div>
                        <h1 className="lbName">{props.name}</h1>

                        <h5 className="lbYear">{props.year}</h5>

                        <div className="flexRow">
                            <h3
                                className="tooltip lbPantone"
                                onClick={() =>
                                    navigator.clipboard
                                        .writeText(props.pantone_value)
                                        .then(() => setCopied(true))
                                }
                            >
                                <label>Pantone:</label>
                                <br /> {props.pantone_value}
                                <span className="tooltipMsg">
                                    {copied ? "HEX copied!" : "Click to Copy"}
                                </span>
                            </h3>
                            <h3
                                className="tooltip lbHex"
                                onClick={() =>
                                    navigator.clipboard
                                        .writeText(props.color)
                                        .then(() => setCopied(true))
                                }
                            >
                                <label>HEX:</label> <br />
                                {props.color}
                                <span className="tooltipMsg">
                                    {copied ? "HEX copied!" : "Click to Copy"}
                                </span>
                            </h3>
                            <div />
                        </div>
                    </div>
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
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        )
        r = color[1]
        g = color[2]
        b = color[3]
    } else {
        // If hex --> Convert it to RGB
        color = +(
            "0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")
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
