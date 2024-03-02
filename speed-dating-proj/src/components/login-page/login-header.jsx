import { Flex, Image, useTheme } from "@aws-amplify/ui-react";
import logo from '../../assets/flash-flirt-text.png'


export function LoginHeader() {
    const { tokens } = useTheme();

    return (
        <Flex justifyContent="center">
            <Image
                alt="logo"
                src={logo}
                padding={tokens.space.medium}
            />
        </Flex>
    );
}
