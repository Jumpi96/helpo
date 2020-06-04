FROM bitwalker/alpine-elixir-phoenix@sha256:9ccd84fcdbbe8221884b46048cd2a67a2db6a20bdcde4222da2c5eff35b58d6d

# Set exposed ports
EXPOSE 5000
ENV PORT=5000
#ENV MIX_ENV=prod

# Cache elixir deps
ADD mix.exs mix.lock ./
RUN mix do deps.get, deps.compile

# Same with npm deps
ADD assets/package.json assets/
RUN cd assets && \
    npm install

ADD . .

# Run frontend build, compile, and digest assets
RUN cd assets/ && \
    npm run deploy && \
    cd - && \
    mix do compile, phx.digest

USER default

CMD ["mix", "phx.server"]