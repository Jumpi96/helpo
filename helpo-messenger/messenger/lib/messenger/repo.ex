defmodule Messenger.Repo do
  use Ecto.Repo,
    otp_app: :messenger,
    adapter: Ecto.Adapters.Postgres
end
