defmodule MessengerWeb.PageController do
  use MessengerWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
