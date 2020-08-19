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

const App = () => {
    const [colors, setColors] = React.useState([])
    const [showLightbox, setShowLightbox] = React.useState(false)
    const [lightbox, setLightbox] = React.useState({})

    // todo: add loading
    // Fetching data from endpoint on page load
    React.useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((results) => {
                setColors(results.data)
                console.log(results.data)
            })
            .catch((reason) => {
                // todo: move data to frontend
                // todo: more error handling
                console.log(reason)
            })
    }, [])

    return (
        <>
            <div style={{ maxWidth: "600px", margin: "150px auto" }}>
                {colors.map((color, index) => (
                    <div
                        key={`${color.name}_${index}`}
                        className="colorCard"
                        style={{
                            backgroundColor: color.color,
                            padding: "30px",
                            margin: "20px",
                            borderRadius: "5px",
                        }}
                        onClick={() => {
                            setShowLightbox(true)
                            setLightbox(color)
                        }}
                    >
                        <h4 style={{ color: "#fff", textAlign: "center" }}>
                            {color.name}
                        </h4>
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
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                left: 0,
                top: 0,
                position: "fixed",
            }}
        >
            <div
                onClick={close}
                style={{
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "#000000ab",
                    left: 0,
                    top: 0,
                    position: "fixed",
                }}
            />
            <div
                style={{
                    backgroundColor: props.color,
                    padding: "30px",
                    margin: "auto",
                    borderRadius: "5px",
                    width: "300px",
                    height: "300px",
                    zIndex: 100,
                }}
            >
                <h4 style={{ color: "#fff", textAlign: "center" }}>
                    Name: {props.name}
                    <br />
                    HEX: {props.color}
                    <br />
                    Year: {props.year}
                    <br />
                    Pantone Value: {props.pantone_value}
                    <br />
                </h4>
            </div>
        </div>
    )
}
