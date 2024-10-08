import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // Types
  type ConfigVersion = {
    content: Text;
    timestamp: Time.Time;
  };

  type Config = {
    name: Text;
    versions: [ConfigVersion];
  };

  // State
  private stable var configEntriesStable : [(Text, Config)] = [];
  private var configs = HashMap.HashMap<Text, Config>(10, Text.equal, Text.hash);

  // Initialize configs from stable storage
  private func loadConfigs() {
    for ((name, config) in configEntriesStable.vals()) {
      configs.put(name, config);
    };
  };

  // Save configs to stable storage
  system func preupgrade() {
    configEntriesStable := Iter.toArray(configs.entries());
  };

  // Clear temporary state
  system func postupgrade() {
    configEntriesStable := [];
  };

  // Helper function to get current timestamp
  private func now() : Time.Time {
    return Time.now();
  };

  // Add or update a configuration
  public shared(msg) func addConfig(name: Text, content: Text) : async Result.Result<(), Text> {
    // TODO: Implement proper authentication
    if (Principal.isAnonymous(msg.caller)) {
      return #err("Authentication required");
    };

    let newVersion : ConfigVersion = {
      content = content;
      timestamp = now();
    };

    switch (configs.get(name)) {
      case (null) {
        let newConfig : Config = {
          name = name;
          versions = [newVersion];
        };
        configs.put(name, newConfig);
      };
      case (?existingConfig) {
        let updatedVersions = Array.append(existingConfig.versions, [newVersion]);
        let updatedConfig : Config = {
          name = name;
          versions = updatedVersions;
        };
        configs.put(name, updatedConfig);
      };
    };

    #ok(())
  };

  // Get a specific configuration
  public query func getConfig(name: Text) : async Result.Result<Config, Text> {
    switch (configs.get(name)) {
      case (null) { #err("Configuration not found") };
      case (?config) { #ok(config) };
    }
  };

  // Get all configuration names
  public query func getAllConfigNames() : async [Text] {
    Iter.toArray(configs.keys())
  };

  // Get the diff between two versions of a configuration
  public query func getDiff(name: Text, version1: Nat, version2: Nat) : async Result.Result<Text, Text> {
    switch (configs.get(name)) {
      case (null) { #err("Configuration not found") };
      case (?config) {
        if (version1 >= config.versions.size() or version2 >= config.versions.size()) {
          return #err("Invalid version numbers");
        };
        let content1 = config.versions[version1].content;
        let content2 = config.versions[version2].content;
        // This is a very simple diff. In a real-world scenario, you'd want to use a more sophisticated diff algorithm.
        if (content1 == content2) {
          #ok("No differences")
        } else {
          #ok("Differences found between version " # Nat.toText(version1) # " and version " # Nat.toText(version2))
        }
      };
    }
  };

  // Initialize the actor
  loadConfigs();
}
