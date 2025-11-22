export type PartialInstruction={
    comment: string,
    commentDisplay:string,
    operands: Operand[]|null,
    address: number,
    opcodeId:number,
}
export type RawInstruction = {
    opcode:string,
    len:number,
    name:string,
    constraints:ConstraintMap[]|null,
    binMask:number,
    binOpcode:number,
    action:string,
    description:string,
}
export type ConstraintMap = {
    map:number,
    constraints:string,
}
export type Operand= {
    name: string,
    constraint:string,
    value: number,
    operandInfo: OperandInfo|null,

}
export type OperandInfo = {
    registerName:string,
    registerMask:string,
    description:string,
}

export type ProjectState={
    name: string,
    mcu:string,
}