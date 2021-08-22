# Silo Interview Project

## Challenge

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

- To submit, simply fork this codepen, implement your solution and send it to us via LinkedIn or via email to antonio.

## Solution - An array of colors

This is a demo application, in response to Silo's magic color challenge.

This is a grid of cards with each showing color in the background(from HEX value) and has the name of the color either light or dark to contrast the background color.

On hover, each card zooms without shifting or moving any adjacent cards.

On clicking, the card opens a lightbox modal in the center of the page, displaying more details about that color and a random photo(from unsplash) with reference to that color.

Clicking on the HEX value or pantone value will copy to clipboard.

Clicking out of the card will close the lightbox modal.
