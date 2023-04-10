import { StyleSheet } from 'react-native';
import { getStyleValue, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Icon, IconProps } from '../Icon';
import { defaultTheme } from '../ThemeProvider/context';
import { Button } from './';
import type { ButtonProps } from './Button';

export interface ButtonIconProps extends Omit<ButtonProps, 'children'>, Omit<IconProps, 'style'> {
  rounded?: boolean;
}

const _ButtonIcon: RNFunctionComponent<ButtonIconProps> = ({
  name,
  type,
  solid,
  size = 20,
  brand,
  color,
  theme = defaultTheme,
  rounded = true,
  variant = 'text',
  ...props
}) => {
  const _color =
    getStyleValue(props.style, ['backgroundColor'], color) ||
    (variant === 'filled' ? theme?.colors.white : theme?.colors.primary);

  const _finalStyle = StyleSheet.flatten([
    styles.basic,
    rounded && {
      borderRadius: 250,
    },
    props.style,
    {
      width: size + getStyleValue(props.style, ['padding', 'paddingHorizontal'], 8) * 2,
      height: size + getStyleValue(props.style, ['padding', 'paddingVertical'], 8) * 2,
    },
    _color && {
      backgroundColor: variant === 'filled' ? theme?.colors.primary : _color,
    },
  ]);

  return (
    <Button {...props} variant={variant} style={_finalStyle}>
      <Icon
        name={name}
        type={type}
        size={size}
        brand={brand}
        solid={solid}
        color={_color}
        style={styles.icon}
      />
    </Button>
  );
};

const styles = StyleSheet.create({
  basic: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 0,
  },
});

_ButtonIcon.displayName = 'ButtonIcon';

export const ButtonIcon = withConfig(_ButtonIcon);
