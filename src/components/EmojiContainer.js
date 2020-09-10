import React from 'react'
import '../css/style.scss'

const EmojiConatiner = (props) => {
  // https://getemoji.com/
  // const emoji = '😀,😁,😂,🤣,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,🥰,😗,😙,😚,☺️,🙂,🤗,🤩,🤔,🤨,😐,😑,😶,🙄,😏,😣,😥,😮,🤐,😯,😪,😫,😴,😌,😛,😜,😝,🤤,😒,😓,😔,😕,🙃,🤑,😲,☹️,🙁,😖,😞,😟,😤,😢,😭,😦,😧,😨,😩,🤯,😬,😰,😱,🥵,🥶,😳,🤪,😵,😡,😠,🤬,😷,🤒,🤕,🤢,🤮,🤧,😇,🤠,🤡,🥳,🥴,🥺,🤥,🤫,🤭,🧐,🤓,😈,👿,👹,👺,💀,👻,👽,🤖,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾'

  const emojiSmileys = '😁,😂,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,😚,☺️,😐,😶,😏,😣,😥,😪,😫,😌,😜,😝,😒,😓,😔,😲,☹️,😖,😞,😤,😢,😭,😨,😩,😰,😱,😳,😵,😡,😠,😷,😇,😈,👿,👹,👺,💀,👻,👽,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾'
  const emojiGestures = '👋,✋,👌,✌,👈,👉,👆,👇,👍,👎,✊,👊,👏,🙌,👐,🙏,✍️,💅,💪,👂,👃,👀,👅,👄,💋'

  return (
    <div className={(props.getState === true) ? 'emoji-container active' : 'emoji-container'}>      
      { emojiSmileys && emojiSmileys.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            props.selectEmoji({ emoji: e.currentTarget.textContent, timestamp: new Date().getTime() })
            props.setState(false)
          }}>
          {m}
        </div>
      )) }      
      { emojiGestures && emojiGestures.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            props.selectEmoji({ emoji: e.currentTarget.textContent, timestamp: new Date().getTime() })
            props.setState(false)
          }}>
          {m}
        </div>
      )) }
    </div>
  )
}

export default EmojiConatiner
