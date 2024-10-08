export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const ConfigVersion = IDL.Record({
    'content' : IDL.Text,
    'timestamp' : Time,
  });
  const Config = IDL.Record({
    'name' : IDL.Text,
    'versions' : IDL.Vec(ConfigVersion),
  });
  const Result_1 = IDL.Variant({ 'ok' : Config, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addConfig' : IDL.Func([IDL.Text, IDL.Text], [Result_2], []),
    'getAllConfigNames' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getConfig' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'getDiff' : IDL.Func([IDL.Text, IDL.Nat, IDL.Nat], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
