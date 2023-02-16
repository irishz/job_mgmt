import {FormHelperText} from '@chakra-ui/react'

interface ErrProps {
    message?: string
}

export default function ErrMessage({message}: ErrProps) {
  return (
    <FormHelperText color={'tomato'}>{message}</FormHelperText>
  )
}