import { AssistantMessage } from "./index.ts"

export default interface AssistantChat {
    id: string
    messages: AssistantMessage[]

}