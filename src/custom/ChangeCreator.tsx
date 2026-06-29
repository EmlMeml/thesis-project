export const ChangeCreator = () => {
  return (
    <div id="change-creator" className="change-creator">
        <h3>Create your Pebble</h3>
        <div id="change-description-container">
            <p>Describe the changes you want to make:</p>
            <textarea id="change-description" className="change-description" placeholder="Enter your change description here..." rows={5}></textarea>
        </div>
        <div id="change-scope-container">
            <p>Describe the scope of the changes:</p>
            <input type="radio" id="change-scope-word" name="change-scope" value="word" />
            <label htmlFor="change-scope-word">Puddle</label>
            <input type="radio" id="change-scope-sentence" name="change-scope" value="sentence" />
            <label htmlFor="change-scope-sentence">Pond</label>
            <input type="radio" id="change-scope-paragraph" name="change-scope" value="paragraph" />
            <label htmlFor="change-scope-paragraph">Lake</label>
       </div>
        <div id="change-intensity-container">
            <p>Describe the intensity of the changes:</p>
            <input type="range" id="change-intensity" className="change-intensity" min="1" max="5" defaultValue="3" />
        </div>
       <div id="change-visualize-container">
        //Todo: Add dynamic pic for stone that is "thrown" based on the intensity of the change
       </div>
    </div>
    );
}