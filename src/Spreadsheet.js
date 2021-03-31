export default class Spreadsheet {
	constructor() {
		this.columnNames = ['__avg__'];
		this.columnTypes = ['a'];
		// this.columnWeights = [undefined];
		this.rows = [];
	}

	addColumn(name, type) {
		if (name.length === 0 ||
			/^[t+-]$/.test(type) === false ||
			this.columnNames.includes(name)) {
			return false;
		} else {
			// __avg__ should always be last
			const avgName = this.columnNames.pop();
			const avgType = this.columnTypes.pop();
			this.columnNames.push(name);
			this.columnTypes.push(type);
			for (let row of this.rows) {
				if (type === 't') {
					row[name] = { 'value': name };
				} else {
					row[name] = { 'value': 0, 'score': 0 };
				}
			}
			// put __avg__ back at the end
			this.columnNames.push(avgName);
			this.columnTypes.push(avgType);
			return true;
		}
	}

	addRow() {
		let row = {};
		for (let i = 0; i < this.columnNames.length - 1; i++) {
			const name = this.columnNames[i];
			if (this.columnTypes[i] === 't') {
				row[name] = { 'value': name };
			} else {
				row[name] = { 'value': 0, 'score': 0 };
			}
		}
		row['__avg__'] = { 'value': 0 };
		// row['__wghtAvg__'] = { 'value': 0 };
		this.rows.push(row);
		this.calculateAllScores();
	}

	deleteLastColumn() {
		if (this.columnNames.length === 1) {
			return false;
		} else {
			// __avg__ should always be last
			const avgName = this.columnNames.pop();
			const avgType = this.columnTypes.pop();
			const name = this.columnNames.pop();
			this.columnTypes.pop();
			for (let row of this.rows) {
				delete row[name];
			}
			// put __avg__ back at the end
			this.columnNames.push(avgName);
			this.columnTypes.push(avgType);
			this.calculateRowAverages();
			return true;
		}
	}

	deleteLastRow() {
		if (this.rows.length === 0) {
			return false;
		} else {
			this.rows.pop();
			this.calculateAllScores();
			return true;
		}
	}

	setValue(rowNum, colNum, value) {
		if (this.columnTypes[colNum] !== 't' && typeof value !== 'number') {
			return false;
		} else if (colNum >= this.columnTypes.length - 1) {
			// cannont set value for __avg__
			return false;
		} else {
			const name = this.columnNames[colNum];
			this.rows[rowNum][name]['value'] = value;
			if (this.columnTypes[colNum] !== 't') {
					this.calculateColumnScores(colNum);
					this.calculateRowAverages();
			}
			return true;
		}
	}

	setColumnName(colNum, name) {
		const oldName = this.columnNames[colNum];
		this.columnNames[colNum] = name;
		for (let row of this.rows) {
			row[name] = row[oldName];
			delete row[oldName];
		}
	}

	setColumnType(colNum, type) {
		this.columnTypes[colNum] = type;
		this.calculateColumnScores(colNum);
		this.calculateRowAverages();
	}

	printToConsole() {
		let title = '#';
		for (let i = 0; i < this.columnNames.length - 1; i++) {
			title += `\t${this.columnNames[i]}(${this.columnTypes[i]})`;
		}
		title += '\t__average__'
		console.log(title);
		for (let i = 0; i < this.rows.length; i++) {
			let line = `${i+1}`
			for (let j = 0; j < this.columnNames.length - 1; j++) {
				let name = this.columnNames[j]
				line += `\t${this.rows[i][name]['value']}`
				if (this.columnTypes[j] !== 't') {
					line += ` (${this.rows[i][name]['score']})`
				}
			}
			line += `\t\t${this.rows[i]['__avg__']['value']}`
			console.log(line);
		}
	}

	static percentRankScore(arr, num) {
		let smaller = 0;
		let larger = 0;
		for (let n of arr) {
			if (n < num) smaller++;
			else if (n > num) larger++;
		}
		if (smaller === 0 && larger === 0) return 10;
		return smaller / (smaller + larger) * 9 + 1;
	}

	calculateColumnScores(colNum) {
		if (colNum >= this.columnNames.length - 1 || this.rows.length === 0 || this.columnTypes[colNum] === 't') {
			return false;
		}
		const name = this.columnNames[colNum];
		const type = this.columnTypes[colNum];
		const mult = (type === '+') ? 1 : -1;
		let allValues = [];
		for (let row of this.rows) {
			allValues.push(row[name]['value'] * mult);
		}
		for (let row of this.rows) {
			row[name]['score'] = Spreadsheet.percentRankScore(allValues, row[name]['value'] * mult);
		}
		return true;
	}

	static average(arr) {
		let sum = 0;
		for (let n of arr) {
			sum += n;
		}
		return sum / arr.length;
	}

	calculateRowAverages() {
		for (let row of this.rows) {
			let scores = []
			for (let i = 0; i < this.columnTypes.length - 1; i++) {
				if (this.columnTypes[i] === '+' || this.columnTypes[i] === '-') {
					const name = this.columnNames[i];
					scores.push(row[name]['score']);
				}
			}
			if (scores.length > 0) {
				row['__avg__']['value'] = Spreadsheet.average(scores);
			}
		}
	}

	calculateAllScores() {
		// last column __avg__ doesn't need a score
		for (let i = 0; i < this.columnTypes.length - 1; i++) {
			if (this.columnTypes[i] === '+' || this.columnTypes[i] === '-') {
				this.calculateColumnScores(i);
			}
		}
		this.calculateRowAverages();
	}

	sortRows(colNum, ascending=true) {
		if (this.rows.length === 0 || colNum < 0 || colNum >= this.columnNames.length) {
			return false;
		} else {
			const name = this.columnNames[colNum];
			const mult = (ascending === true) ? 1 : -1;
			this.rows.sort((a,b) => {
				if (a[name]['value'] < b[name]['value']) {
					return -1 * mult;
				} else if (a[name]['value'] > b[name]['value']) {
					return 1 * mult;
				} else {
					return 0;
				}
			});
			return true;
		}
	}
}

/* testing in the console: */

// let sheet = new Spreadsheet();
// sheet.addColumn('TEXT', 't');
// sheet.addColumn('BIG', '+');
// sheet.addColumn('SMALL', '-');
// sheet.addRow();
// sheet.setValue(0,0, 'hello');
// sheet.setValue(0,1, Math.floor(Math.random() * 100));
// sheet.setValue(0,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(1,0, 'world');
// sheet.setValue(1,1, Math.floor(Math.random() * 100));
// sheet.setValue(1,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(2,0, 'zap');
// sheet.setValue(2,1, Math.floor(Math.random() * 100));
// sheet.setValue(2,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(3,0, 'pow');
// sheet.setValue(3,1, Math.floor(Math.random() * 100));
// sheet.setValue(3,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(4,0, 'blam');
// sheet.setValue(4,1, Math.floor(Math.random() * 100));
// sheet.setValue(4,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(5,0, 'blah');
// sheet.setValue(5,1, Math.floor(Math.random() * 100));
// sheet.setValue(5,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(6,0, 'foo');
// sheet.setValue(6,1, Math.floor(Math.random() * 100));
// sheet.setValue(6,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(7,0, 'bar');
// sheet.setValue(7,1, Math.floor(Math.random() * 100));
// sheet.setValue(7,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(8,0, 'fizz');
// sheet.setValue(8,1, Math.floor(Math.random() * 100));
// sheet.setValue(8,2, Math.floor(Math.random() * 100));
// sheet.addRow();
// sheet.setValue(9,0, 'buzz');
// sheet.setValue(9,1, Math.floor(Math.random() * 100));
// sheet.setValue(9,2, Math.floor(Math.random() * 100));
// sheet.printToConsole();
// console.log('\nSorted:');
// sheet.setColumnName(2, 'PLUS');
// sheet.setColumnType(2, '+')
// sheet.sortRows(3, false);
// sheet.printToConsole();
