var http = require('http');
var Emitter = require('events').EventEmitter;
var helper = require('./lib/helper');
var exec = require('child_process').exec;
var fs = require('fs');

function GithubDeploy(){

	var defaultConfig = {
		/**
		 * route
		 * @type {Object} the key is github repo url, the value is directory to deploy the code on your machine
		 * example
		 *
		 * 	{
		 * 		'STU-Fudan/testDeploy': '/home/stu/www/test1',
		 * 		'STU-Fudan/test': '/home/stu/www/test2'
		 * 	}
		 */
		route: {},
		port: 2333
	};

	this.config = defaultConfig;

	this.init();

}

// simplify the POST data from github, only extract what I need
GithubDeploy.prototype.githubEventHookDataSimplify = function(githubEventHookData){
	var githubEventHookData = githubEventHookData || {};

	var rRef = /refs\/(heads|tags)\/(.*)$/;
	var refMatches = (githubEventHookData.ref || '').match(rRef);

	var branch = '';
	var tag = '';

	if (refMatches){
		switch (refMatches[1]){
			case 'heads':
				branch = refMatches[2];
				break;
			case 'tags':
				tag = refMatches[2];
				break;
			default:
		}
	}

	var repo = githubEventHookData.repository.url || '';
	var rRepo = /https:\/\/github.com\/(.*)$/;
	repo = repo.match(rRepo)[1];

	var ret = {
		branch: branch,
		tag: tag,
		repo: repo
	}

	return ret;
}

GithubDeploy.prototype.init = function(){

	var self = this;

	function serverHandler(req, res){
		var dataRaw = '';

		if (req.method === 'POST'){
			req.on('data', function(chunk){
				dataRaw += chunk;
			});

			req.on('end', function(){
				res.end();
				dataRaw = JSON.parse(dataRaw);
				var data = self.githubEventHookDataSimplify(dataRaw);
				if (data.branch === 'publish'){
					self.handle(data);
				}
			});
		}
	}

	self.server = http.createServer(serverHandler);

}

GithubDeploy.prototype.handle = function(data){

	var route = this.config.route,
		repo;
	for (repo in route){
		if (data.repo === repo){
			this.deploy(route[repo]);
			return true;
		}
	}

	console.warn('webhook [' + data.repo + '] not correctly routed!\n');
	return false;
}

GithubDeploy.prototype.deploy = function(directory){
	fs.exists(directory, function(exists){
		console.log(exists, directory);
		if (exists){
			exec('cd ' + directory + ' && git pull && git checkout publish', function(error, stdout, stderror){
				if (error){
					console.log(error);
				}
			});
		}
	});
}

GithubDeploy.prototype.configure = function(config){
	this.config = helper.merge(this.config, config);
	return this;
}

GithubDeploy.prototype.run = function(){

	if (helper.isEmptyObject(this.config.route)){
		throw 'route must not be empty!';
	}

	this.server.listen(this.config.port, '127.0.0.1');
	console.log('auto deploy server is now running at port ' + this.config.port + ' ... \n');
}

module.exports.factory = function(){
	return new GithubDeploy();
}
