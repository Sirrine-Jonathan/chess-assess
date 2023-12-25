build:
	yarn install
	rm -rf public/hi-ogawa_stockfish_nnue_wasm && ln -s $$PWD/node_modules/stockfish-nnue.wasm public/hi-ogawa_stockfish_nnue_wasm
	rm -rf public/nmrugg_stockfish_js && ln -s $$PWD/node_modules/stockfish/src public/nmrugg_stockfish_js
	yarn build

clean:
	rm -rf node_modules
	rm -rf public/hi-ogawa_stockfish_nnue_wasm
	rm -rf public/nmrugg_stockfish_js
	rm -rf build

run:
	yarn start
