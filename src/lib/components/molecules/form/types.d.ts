export type Option =
	| string
	| {
			value: string;
			label: string;
	  };

export type Options = Option[] | (() => Promise<Option[]> | Option[]);
