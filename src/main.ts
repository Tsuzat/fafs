import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { handleRedirects } from "./helpers";

const resolveRedirect = () => {
  const url = new URL(window.location.href);
  const q = url.searchParams.get("q")?.trim() ?? "";
  if (q !== "") {
    handleRedirects(q);
    return null;
  }

  return mount(App, {
    target: document.getElementById("app")!,
  });
};

const app = resolveRedirect();

export default app;
