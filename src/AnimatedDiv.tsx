import React from 'react';
import { Transition } from 'react-transition-group'

interface Props extends React.ComponentProps<'div'> {
    in: boolean
    fromStyle: React.CSSProperties
    toStyle: React.CSSProperties
    timeout?: number
}

export default ({ in: inProp, fromStyle, toStyle, timeout = 200, ...props }: Props) => {
    return <Transition
        in={inProp}
        timeout={timeout}
        mountOnEnter
        unmountOnExit
        nodeRef={null}
    >
        {state => {
            const stateStyles = {
                entering: fromStyle,
                entered: toStyle,
                exiting: toStyle,
                exited: fromStyle,
            }
            return <div
                {...props}
                style={{
                    ...stateStyles[state],
                    transition: `all ${timeout}ms ease-in-out`,
                    ...props.style
                }}
            />
        }}
    </Transition>
}
