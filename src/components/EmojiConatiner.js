import React from 'react';
import ReactDOM from "react-dom";
import '../css/style.scss';

const EmojiConatiner = (props) => {
  const emoji = '😀,😁,😂,🤣,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,🥰,😗,😙,😚,☺️,🙂,🤗,🤩,🤔,🤨,😐,😑,😶,🙄,😏,😣,😥,😮,🤐,😯,😪,😫,😴,😌,😛,😜,😝,🤤,😒,😓,😔,😕,🙃,🤑,😲,☹️,🙁,😖,😞,😟,😤,😢,😭,😦,😧,😨,😩,🤯,😬,😰,😱,🥵,🥶,😳,🤪,😵,😡,😠,🤬,😷,🤒,🤕,🤢,🤮,🤧,😇,🤠,🤡,🥳,🥴,🥺,🤥,🤫,🤭,🧐,🤓,😈,👿,👹,👺,💀,👻,👽,🤖,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾';

  console.log('inputt', props);
  React.useEffect(() => {

  },[]);

  return (
    <div className={props.getState === true ? 'emoji-container active' : 'emoji-container'}>
      { emoji && emoji.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            // const inputElement = document.getElementsByClassName('message-input')[0];
            // if (inputElement) {
            //   inputElement.value = inputElement.value + 'emoji'
            // }

            props.selectEmoji({ emoji: e.currentTarget.textContent, timestamp: new Date().getTime() });

            console.log(e)
            console.log(props)
          }}>
          {m}
        </div>
      )) }
    </div>
  )
}

  // <p>😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🤡🥳🥴🥺🤥🤫🤭🧐🤓😈👿👹👺💀👻👽🤖💩😺😸😹😻😼😽🙀😿😾</p>

export default EmojiConatiner
