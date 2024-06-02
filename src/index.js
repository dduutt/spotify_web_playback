import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store/store";
import dotenv from "dotenv";

import App from "./App";

dotenv.config()

ReactDOM.render(
  <Provider store={configureStore}>
    <App />
  </Provider>,
  document.getElementById("root")
);
