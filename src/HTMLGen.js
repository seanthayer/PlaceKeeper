class HTMLGen {
  NewPinForm() {
    return(`
      <div class="pin-infoform-container">
  
        <h2 class="pin-infoform-title">Create New Pin</h2>
  
        <fieldset class="pin-infoform-fieldset">
  
          <legend>Pin Details</legend>
  
          <label for="pin-infoform-name">Name:</label>
          <input type="text" class="pin-infoform-name" name="name" maxlength="30" placeholder="Max 30 characters" /><br/><br/>
  
          <label for="pin-infoform-description">Description</label><br/>
          <textarea class="pin-infoform-description" name="description" rows="4" cols="28" maxlength="200" placeholder="Max 200 characters"></textarea><br/>
  
          <div class="pin-infoform-buttons-container">
            <button type="button" name="cancel">Cancel</button>
            <button type="button" name="save">Save</button>
          </div>
  
        </fieldset>
  
      </div>
    `);
  }
}

export default HTMLGen;