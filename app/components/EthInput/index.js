import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontStyles } from '../../styles/common';
import { connect } from 'react-redux';
import { isBN, weiToFiat, isDecimal, toWei, fromWei } from '../../util/number';

const styles = StyleSheet.create({
	root: {
		...fontStyles.bold,
		backgroundColor: colors.white,
		borderColor: colors.inputBorderColor,
		borderRadius: 4,
		borderWidth: 1,
		flex: 1,
		paddingLeft: 10,
		paddingRight: 40,
		paddingVertical: 6,
		position: 'relative',
		zIndex: 1
	},
	input: {
		...fontStyles.bold,
		flex: 0,
		fontSize: 16,
		minWidth: 44,
		paddingRight: 8
	},
	eth: {
		...fontStyles.bold,
		flex: 0,
		fontSize: 16
	},
	fiatValue: {
		...fontStyles.normal,
		fontSize: 12,
		marginTop: 4
	},
	split: {
		flex: 0,
		flexDirection: 'row'
	}
});

/**
 * Form component that allows users to type an amount of ETH and its fiat value is rendered dynamically
 */
class EthInput extends Component {
	static propTypes = {
		/**
		 * ETH-to-current currency conversion rate from CurrencyRateController
		 */
		conversionRate: PropTypes.number,
		/**
		 * Currency code for currently-selcted currency from CurrencyRateController
		 */
		currentCurrency: PropTypes.string,
		/**
		 * Callback triggered when this input value
		 */
		onChange: PropTypes.func,
		/**
		 * Makes this input readonly
		 */
		readonly: PropTypes.bool,
		/**
		 * Value of this underlying input expressed as in wei as a BN instance
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	};

	onChange = value => {
		const { onChange } = this.props;
		onChange && onChange(isDecimal(value) ? toWei(value) : value);
	};

	render() {
		const { conversionRate, currentCurrency, readonly, value } = this.props;
		return (
			<View style={styles.root}>
				<View style={styles.split}>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						editable={!readonly}
						keyboardType="numeric"
						numberOfLines={1}
						onChangeText={this.onChange}
						placeholder={'0.00'}
						spellCheck={false}
						style={styles.input}
						value={isBN(value) ? fromWei(value).toString() : value}
					/>
					<Text style={styles.eth} numberOfLines={1}>
						ETH
					</Text>
				</View>
				<Text style={styles.fiatValue} numberOfLines={1}>
					{weiToFiat(value, conversionRate, currentCurrency).toUpperCase()}
				</Text>
			</View>
		);
	}
}

const mapStateToProps = ({ backgroundState: { CurrencyRateController } }) => ({
	conversionRate: CurrencyRateController.conversionRate,
	currentCurrency: CurrencyRateController.currentCurrency
});

export default connect(mapStateToProps)(EthInput);