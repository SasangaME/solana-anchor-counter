import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import assert from "assert";

const { SystemProgram } = anchor.web3;

describe("counter", () => {
  // Configure the client to use the local cluster.
  // anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.AnchorProvider.local();

  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  let _baseAccount: anchor.web3.Keypair;

  const program = anchor.workspace.Counter as Program<Counter>;

  const baseAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    await program.rpc.initialize({
      accounts: {
        myAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    // Fetch the newly created account from the cluster.
    const account = await program.account.myAccount.fetch(baseAccount.publicKey);

    // Check it's state was initialized.
    // assert.ok(account.data.eq(new anchor.BN(0)));
    assert.equal(account.data, 0);

    // Store the account for the next test.
    _baseAccount = baseAccount;
  });

  it("Updates a previously created account", async () => {
    const baseAccount = _baseAccount;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.Counter as Program<Counter>;

    // Invoke the update rpc.
    await program.rpc.update(new anchor.BN(100), {
      accounts: {
        myAccount: baseAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(baseAccount.publicKey);

    // Check it's state was mutated.
    // assert.ok(account.data.eq(new anchor.BN(4321)));
    assert.equal(account.data, 100);

    // #endregion update-test
  });

  it("Increment a previously created account", async () => {
    const myAccount = _baseAccount;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.Counter as Program<Counter>;

    // Invoke the update rpc.
    await program.rpc.increment({
      accounts: {
        myAccount: baseAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(baseAccount.publicKey);

    // Check it's state was mutated.
    // assert.ok(account.data.eq(new anchor.BN(4321)));
    assert.equal(account.data, 101);

    // #endregion update-test
  });

  it("Decrement a previously created account", async () => {
    const baseAccount = _baseAccount;

    // #region update-test

    // The program to execute.
    const program = anchor.workspace.Counter as Program<Counter>;

    // Invoke the update rpc.
    await program.rpc.decrement({
      accounts: {
        myAccount: baseAccount.publicKey,
      },
    });

    // Fetch the newly updated account.
    const account = await program.account.myAccount.fetch(baseAccount.publicKey);

    // Check it's state was mutated.
    // assert.ok(account.data.eq(new anchor.BN(4321)));
    assert.equal(account.data, 100);

    // #endregion update-test
  });
});
