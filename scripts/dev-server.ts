import process from 'process';
import fs from 'fs';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import pagesConfig from '../src/pages-config';
const clearConsole = require('react-dev-utils/clearConsole');
const { choosePort, createCompiler, prepareProxy, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');
import { resolveApp } from '../config/kit';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', (err) => {
	throw err;
});

const useYarn = fs.existsSync(resolveApp('yarn.lock'));
const isInteractive = process.stdout.isTTY;

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
	console.log(
		chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`)
	);
	console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);

	console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`);
	console.log();
}

// We attempt to use the default port but if it is busy, we offer the user to run on a different port. `choosePort()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
	.then((port: number) => {
		if (port == null) {
			// We have not found a port.
			return;
		}
		const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
		const appName = require(resolveApp('package.json')).name;
		const urls = prepareUrls(protocol, HOST, port);
		// Create a webpack compiler that is configured with custom messages.
		const compiler = createCompiler(webpack, config, appName, urls, useYarn);
		// Load proxy config
		const proxySetting = require(resolveApp('package.json')).proxy;
		const proxyConfig = prepareProxy(proxySetting, resolveApp('public'));
		// Serve webpack assets generated by the compiler over a web sever.
		const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);

		const devServer = new WebpackDevServer(compiler, serverConfig);
		// Launch WebpackDevServer.

		devServer.listen(port, HOST, (err) => {
			if (err) {
				return console.log(err);
			}
			if (isInteractive) {
				clearConsole();
			}

			console.log(chalk.cyan('Starting the development server...\n'));
			openBrowser(urls.localUrlForBrowser + pagesConfig[0].name + '.html');
		});

		[ 'SIGINT', 'SIGTERM' ].forEach(function(sig) {
			process.on(sig as any, function() {
				devServer.close();
				process.exit();
			});
		});
	})
	.catch((err: any) => {
		if (err && err.message) {
			console.log(err.message);
		}
		process.exit(1);
	});
