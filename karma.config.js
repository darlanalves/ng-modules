module.exports = function(config) {
	var files = [
		'vendor/angular.js',

		'html-outline/src/module.js',
		'html-outline/src/*.js',
		'html-outline/default-rules.js',
		'html-outline/test/*Spec.js'
	];

	config.set({
		files: files,

		basePath: '.',

		// frameworks to use
		frameworks: ['jasmine'],

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher'
		],

		// web server port
		port: 9800,

		browsers: ['PhantomJS'],
		colors: true,

		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['dots'],

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false,

		proxies: {
			'/': 'http://localhost:5100/'
		},

		urlRoot: '/karma/'
	});
};