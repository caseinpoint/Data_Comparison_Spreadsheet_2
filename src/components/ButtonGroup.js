import React from 'react';

export default class ButtonGroup extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		switch (event.target.id) {
			case 'addRow':
				this.props.sheet.addRow();
				break;
			case 'delRow':
				this.props.sheet.deleteLastRow();
				break;
			case 'delCol':
				this.props.sheet.deleteLastColumn();
				break;
			default:
				console.log('Some other button got pushed!?');
		}
		this.props.sheetUpdated();
	}

	render() {
		return (
			<div className="border py-1 px-3">
				<button id="addRow" className="btn btn-success" onClick={this.handleClick}>Add Row</button>
				<button id="delRow" className="btn btn-danger ml-3" onClick={this.handleClick}>Delete Bottom Row</button>
				<button id="delCol" className="btn btn-danger ml-3" onClick={this.handleClick}>Delete Last Column</button>
			</div>
		);
	}
}
