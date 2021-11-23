import * as vscode from 'vscode';

/**
 * Press F5 to test the extension.
 * Press cmd+shift+F5 to reload
 *
 * The API is available at: https://code.visualstudio.com/api/references/vscode-api
 * The types are available at: node_modules/@types/vscode/index.d.ts
 */
export function activate(context: vscode.ExtensionContext) {
	const output = vscode.window.createOutputChannel("Greg's Gecko Extensions");
	const log = (text: string) => {
		output.append("[greg-gecko] ");
		output.appendLine(text);
	};

	log("Begin initialization.");

	function isPathInObjDir(uri: vscode.Uri) {
		if (uri.scheme !== "file") {
			return false;
		}
		const parts = uri.path.split("/");
		return parts.some(part => part.match(/^obj-/));
	}

	function checkEditor(editor: vscode.TextEditor | undefined) {
		if (!editor) {
			return;
		}
		const { uri } = editor.document;

		if (isPathInObjDir(uri)) {
			log("⚠️ in the objdir:" + uri.path);
			const parts = uri.path.split("/");
			vscode.window.showWarningMessage("File opened in the objdir: " + parts[parts.length - 1]);
		} else {
			log("Not in the objdir:" + uri.path);
		}
	}

	// Call it on the current active editor when it's initialized.
	checkEditor(vscode.window.activeTextEditor);

	// And subscribe to future updates as well.
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(checkEditor));

	// Check that a file is in the objdir when saving
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument((textDocument) => {
		const { uri } = textDocument;
		if (isPathInObjDir(uri)) {
			log("⚠️ Saving file in the objdir:" + uri.path);
			vscode.window.showErrorMessage("Saved file in the objdir: " + uri.path);
		} else {
			log("Saving a file not in the objdir:" + uri.path);
		}
	}));

	log("Initialization complete.");
}

export function deactivate() {}
