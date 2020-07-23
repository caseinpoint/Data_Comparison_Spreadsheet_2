import React from 'react';

export default class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newValue: '',
			isEditing: false
		};
	}

	render() {
		return (
			<td>
				{this.props.value}
			</td>
		);
	}
}
