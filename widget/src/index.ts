import "core-js";
import "regenerator-runtime/runtime";

import mockSurvey from "./mockSurvey";
import Survey from "./widget/Survey";

// Только при подключении через браузер:
const container = document.getElementById("app");

if (container) {
  const widget = new Survey(mockSurvey);

  container.appendChild(widget);
}

export default Survey;
