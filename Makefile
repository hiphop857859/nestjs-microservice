.PHONY: init build test deploy gen-module gen-controller gen-middleware gen-interceptor gen-provider gen-service gen-interface gen-gateway gen-filter gen-decorator gen-guard gen-pipe

# init packages
init:
	docker network create infrastructure || true

# build project
build:
	echo "build"
	npm run build

# Unit tests
# --exit-code-from <service> to get exit code form docker-compose: 0-success, other-fail
test:
	echo "Test"

# deploy
deploy:
	docker-compose -f docker-compose.local.example.yml up -d --build $(service)

# run dev
dev:
	docker-compose -f docker-compose.local.yml up -d --build $(service)

local:
	docker-compose -f docker-compose.local.yml up -d --no-build $(service)

# make gen-res path=microservices/quizz name=quizz

gen-module:
	nest g module $(path)/src/modules/$(name)

gen-controller:
	nest g co $(path)/src/modules/$(module)/controllers/$(name)

gen-middleware:
	nest g middleware $(path)/src/modules/$(module)/middlewares/$(name)

gen-interceptor:
	nest g interceptor $(path)/src/modules/$(module)/interceptors/$(name)

gen-provider:
	nest g provider $(path)/src/modules/$(module)/providers/$(name)

gen-service:
	nest g service $(path)/src/modules/$(module)/services/$(name)

gen-interface:
	nest g interface $(path)/src/modules/$(module)/interfaces/$(name)

gen-gateway:
	nest g gateway $(path)/src/modules/$(module)/gateways/$(name)

gen-filter:
	nest g filter $(path)/src/modules/$(module)/filters/$(name)

gen-decorator:
	nest g decorator $(path)/src/modules/$(module)/decorators/$(name)

gen-guard:
	nest g guard $(path)/src/modules/$(module)/guards/$(name)

gen-pipe:
	nest g pipe $(path)/src/modules/$(module)/pipes/$(name)

gen-res:
	nest g res $(path)/src/modules/$(name)