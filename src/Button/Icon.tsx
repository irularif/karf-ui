import { StyleSheet } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Icon, IconProps } from '../Icon';
import { Button } from './';
import type { ButtonProps } from './Button';

export interface ButtonIconProps extends Omit<ButtonProps, 'children'>, Omit<IconProps, 'style'> {
  rounded?: boolean;
}

const _ButtonIcon: RNFunctionComponent<ButtonIconProps> = ({
  name,
  type,
  solid,
  size = 24,
  brand,
  color,
  rounded = true,
  ...props
}) => {
  const finalStyle = StyleSheet.flatten([
    styles.basic,
    {
      width: size + 12,
      height: size + 12,
    },
    rounded && {
      borderRadius: 9999,
    },
    props.style,
  ]);

  return (
    <Button variant='text' {...props} style={finalStyle}>
      <Icon
        name={name}
        type={type}
        size={size}
        brand={brand}
        solid={solid}
        color={color}
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
