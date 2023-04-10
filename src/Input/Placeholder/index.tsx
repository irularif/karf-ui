import { StyleSheet } from 'react-native';
import type { ButtonLabelProps } from '../../Button';
import { Label } from '../../Button/Label';
import type { RNFunctionComponent } from '../../helpers';
import withConfig from '../../helpers/withConfig';

export interface PlaceholderProps extends ButtonLabelProps {}

const _Placeholder: RNFunctionComponent<PlaceholderProps> = ({ theme, style, ...props }) => {
  const finalStyle = StyleSheet.flatten([
    styles.label,
    {
      color: theme?.colors.black,
    },
    style,
  ]);

  return <Label {...props} style={finalStyle} />;
};

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    textAlign: 'center',
    flexGrow: 1,
    flexShrink: 1,
  },
});

_Placeholder.displayName = 'Placeholder';
export const Placeholder = withConfig(_Placeholder);
