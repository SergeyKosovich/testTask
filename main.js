const addTagsForm = document.getElementById('addTagsForm');
const tagsText = document.getElementById('tagsText');
const tagsArea = document.getElementById('tagsArea');
const readonlyCheckBox = document.getElementById('readonlyCheckBox');

class tagCreator {
  constructor(tagsArea, tagsText, addTagsForm, readonlyCheckBox) {
    this.tagsArea = tagsArea;
    this.tagsText = tagsText;
    this.addTagsForm = addTagsForm;
    this.readonlyCheckBox = readonlyCheckBox;
  }

  get tagList() {
    return JSON.parse(localStorage.getItem('tagsList')) || [];
  }

  set tagList(arr) {
    localStorage.setItem('tagsList', JSON.stringify(arr));
  }

  removeTagFromLocalStorage(tag) {
    const arr = this.tagList;
    const filtedArr = arr.filter((item) => item != tag);
    this.tagList = filtedArr;
  }

  addTagToLocalStorage(tag) {
    const arr = this.tagList;
    arr.push(tag);
    this.tagList = arr;
  }

  get readOnlyModeController() {
    return this.readonlyCheckBox.checked;
  }

  set readOnlyModeController(value) {
    this.readonlyCheckBox.checked = value;
  }

  createElements() {
    const tag = document.createElement('div');
    tag.classList.add('addedTags');
    const text = document.createElement('p');
    const button = document.createElement('button');
    button.classList.add('removeTag');
    return { tag, text, button };
  }

  addText(text, button, itemText) {
    if (!itemText) {
      text.innerText = `${this.tagsText.value}`;
      this.addTagToLocalStorage(this.tagsText.value);
    } else {
      text.innerText = `${itemText}`;
    }
    button.innerText = `x`;
  }

  addListener(button) {
    button.addEventListener('click', (e) => {
      if (this.readOnlyModeController) {
        return;
      }
      this.removeTagFromLocalStorage(e.target.previousSibling.innerText);
      e.target.parentElement.remove();
    });
  }

  appendElements(tag, text, button) {
    tag.append(text, button);
    this.tagsArea.appendChild(tag);
  }

  clearInput() {
    this.tagsText.value = '';
  }
}

class tagsManager extends tagCreator {
  constructor(tagsArea, tagsText, addTagsForm, readonlyCheckBox) {
    super(tagsArea, tagsText, addTagsForm, readonlyCheckBox);
  }

  addElements(itemText) {
    const { tag, text, button } = super.createElements();
    super.addText(text, button, itemText);
    super.addListener(button);
    super.appendElements(tag, text, button);
  }

  addTags(e) {
    e.preventDefault();
    if (this.readOnlyModeController) {
      return;
    }
    this.addElements();
    super.clearInput();
  }

  checkTags() {
    const listArr = JSON.parse(localStorage.getItem('tagsList')) || [];
    if (listArr.length > 0) {
      listArr.forEach((itemText) => {
        this.addElements(itemText);
      });
    }
  }
}

const userTags = new tagsManager(
  tagsArea,
  tagsText,
  addTagsForm,
  readonlyCheckBox
);

userTags.checkTags();

addTagsForm.addEventListener('submit', userTags.addTags.bind(userTags));
