build-dev:
	cd front && $(MAKE) build-dev
	cd back && ${MAKE} build

run-dev:
	docker-compose -f docker-compose-dev.yml  up

###
build-local:
	cd front && $(MAKE) build-local
	cd back && ${MAKE} build

run-local:
	ENV=local docker-compose -f docker-compose-production.yml up

###
build-production:
	cd front && $(MAKE) build-production
	cd back && ${MAKE} build

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up

stop-producton:
	docker-compose -f docker-compose-production.yml down


SSH_STRING:=root@157.245.83.201

ssh:
	ssh ${SSH_STRING}

copy-files:
	scp -r ./* $(SSH_STRING):/root/